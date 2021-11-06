import '../lib/firebase';

import * as AppleAuthentication from 'expo-apple-authentication';
import { ResponseType } from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import {
  EmailAuthProvider,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthCredential,
  OAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  FieldValue,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import Auth from '../lib/auth';
import { removeItem, storageKey } from '../lib/storage';
import { loginUser, logoutUser, User } from '../redux/slices/auth';
import { useAppDispatch } from '../redux/store/hooks';

const auth = getAuth();
const myAuth = new Auth();

WebBrowser.maybeCompleteAuthSession();

export const debug = (text: string, object?: any) => {
  const objectString = object ? ' ' + JSON.stringify(object) : '';
  console.log('\n-----------------\n' + text + objectString);
};

const nonceGen = (length: number) => {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export type UseFirebaseAuth = ReturnType<typeof useFirebaseAuth>;

export interface UserCredentials {
  createdAt: FieldValue;
  updatedAt: FieldValue;
  uid: string;
  displayName: string;
  email: string;
}

const useFirebaseAuth = (errorCallback?: () => void) => {
  const db = getFirestore();
  const currentUser = auth.currentUser;

  const dispatch = useAppDispatch();
  const [setup, setSetup] = useState(false);

  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useIdTokenAuthRequest({
      responseType: ResponseType.IdToken,
      expoClientId: Constants.manifest.extra.expoGoogleClientId,
    });

  const [facebookRequest, facebookResponse, facebookPromptAsync] =
    Facebook.useAuthRequest({
      responseType: ResponseType.Token,
      expoClientId: Constants.manifest.extra.expoFacebookClientId,
    });

  useEffect(() => {
    debug(
      'useFirebaseAuth - useIdTokenAuthRequest google request:',
      googleRequest
    );
  }, [googleRequest]);

  useEffect(() => {
    debug(
      'useFirebaseAuth - useIdTokenAuthRequest google response:',
      googleResponse
    );
  }, [googleResponse]);

  useEffect(() => {
    debug(
      'useFirebaseAuth - useAuthRequest facebook request:',
      facebookRequest
    );
  }, [facebookRequest]);

  useEffect(() => {
    debug(
      'useFirebaseAuth - useAuthRequest facebook response:',
      facebookResponse
    );
  }, [facebookResponse]);

  const onGoogleLogin = useCallback(() => {
    googlePromptAsync();
  }, [googlePromptAsync]);

  const onFacebookLogin = useCallback(() => {
    facebookPromptAsync();
  }, [facebookPromptAsync]);

  const setSession = useCallback(
    async (refresh = false) => {
      const idToken = await myAuth.setSession(refresh);
      debug('useFirebaseAuth - setSession idToken:', idToken);
      return idToken;
    },
    [myAuth.setSession]
  );

  const createOrUpdateUser = (userInfo: User) => {
    try {
      const email = userInfo.email;
      const id = email ?? currentUser?.uid;

      const userRef = doc(db, 'users', id);
      const now = serverTimestamp();

      getDoc(userRef).then(userDoc => {
        if (userDoc.exists) {
          console.log('User already exist, updating updatedAt...');

          updateDoc(userRef, {
            updatedAt: now,
          }).then(() => {
            console.log('Successfully updated user');
          });
        } else {
          console.log('User does not exist, creating ...');

          const userCredentials: UserCredentials = {
            ...userInfo,
            createdAt: now,
            updatedAt: now,
          };

          const newUserRef = doc(collection(db, 'users', id));

          setDoc(newUserRef, userCredentials).then(() => {
            console.log('Successfully added user');
          });
        }
      });
    } catch (error) {
      console.log(error);
      errorCallback?.();
    }
  };

  const firebaseLogin = useCallback(
    async (credential: OAuthCredential) => {
      debug('useFirebaseAuth - firebaseLogin - credential:', credential);
      const data = await signInWithCredential(auth, credential).catch(error => {
        debug(error);
        Alert.alert('Login failed', error);
      });

      if (data) {
        debug('useFirebaseAuth - firebaseLogin - data.user:', data.user);

        const providerUser = data.user.providerData[0];
        const userInfo: User = {
          uid: providerUser.uid,
          displayName: providerUser.displayName,
          email: providerUser.email,
        };
        dispatch(loginUser(userInfo));

        // make sure to create or update the user object as well
        createOrUpdateUser(userInfo);
      }

      return await setSession(true);
    },
    [setSession]
  );

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      debug('useFirebaseAuth - googleResponse - id_token:', id_token);
      const credential = GoogleAuthProvider.credential(id_token);
      firebaseLogin(credential);
    } else if (googleResponse?.type === 'error') {
      debug('google response error:', googleResponse);
      Alert.alert('Login failed. ' + googleResponse);
      errorCallback?.();
    }
  }, [googleResponse, firebaseLogin, errorCallback]);

  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { access_token } = facebookResponse.params;
      debug('useFirebaseAuth - facebookResponse - access_token:', access_token);
      const credential = FacebookAuthProvider.credential(access_token);
      firebaseLogin(credential);
    } else if (facebookResponse?.type === 'error') {
      debug('facebook response error:', facebookResponse);
      Alert.alert('Login failed. ' + facebookResponse);
      errorCallback?.();
    }
  }, [facebookResponse, firebaseLogin, errorCallback]);

  const onAppleLogin = useCallback(async () => {
    const nonce = nonceGen(32);
    const digestedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );

    try {
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: digestedNonce,
      });
      debug('useFirebaseAuth - apple result:', result);

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: result.identityToken || '',
        rawNonce: nonce,
      });

      firebaseLogin(credential);
    } catch (error) {
      debug('error:', error);
      Alert.alert('Login failed. ' + error);
    }
  }, [firebaseLogin]);

  const onEmailAndPasswordSignup = useCallback(
    (name: string, email: string, password: string) => {
      myAuth
        .doCreateUserWithEmailAndPassword(email, password)
        .then(result => {
          // Notice Firebase automatically signs user in when their account is created
          // so dispatch loginUser is not needed
          debug('useFirebaseAuth - onEmailAndPasswordSignup:', result);

          updateProfile(result.user, { displayName: name })
            .then(() => {
              // User account created & signed in!
              // const providerUser = result.user;
              // const userInfo: User = {
              //   uid: providerUser.uid,
              //   displayName: providerUser.displayName,
              //   email: providerUser.email,
              // };
              // dispatch(loginUser(userInfo));

              // login using OAuthCredential, and create user if it doesn't exist
              var credential = EmailAuthProvider.credential(
                email,
                password
              ) as OAuthCredential;
              firebaseLogin(credential);
            })
            .catch(err => {
              Alert.alert('Signup failed', err.message);
            });
        })
        .catch(error => {
          console.log('error: ' + error);
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/email-already-in-use') {
            Alert.alert(
              'Signup failed',
              'That email address is already in use!'
            );
          } else if (errorCode === 'auth/invalid-email') {
            Alert.alert('Signup failed', 'That email address is invalid!');
          } else if (errorCode === 'auth/weak-password') {
            Alert.alert('Signup failed', 'Please choose a stronger password!');
          } else {
            Alert.alert('Signup failed', errorMessage);
          }
        });
    },
    [googlePromptAsync]
  );

  const onEmailAndPasswordLogin = useCallback(
    (email: string, password: string) => {
      myAuth
        .doSignInWithEmailAndPassword(email, password)
        .then(data => {
          // const providerUser = data.user.providerData[0];
          // const userInfo: User = {
          //   uid: providerUser.uid,
          //   displayName: providerUser.displayName,
          //   email: providerUser.email,
          // };
          // dispatch(loginUser(userInfo));

          // login using OAuthCredential, and create user if it doesn't exist
          var credential = EmailAuthProvider.credential(
            email,
            password
          ) as OAuthCredential;
          firebaseLogin(credential);
        })
        .catch(error => {
          console.log('error: ' + error);
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            Alert.alert('Login failed', 'Wrong password!');
          } else if (errorCode === 'auth/invalid-email') {
            Alert.alert('Login failed', 'That email address is invalid!');
          } else if (errorCode === 'auth/user-disabled') {
            Alert.alert('Login failed', 'The user has been disabled!');
          } else if (errorCode === 'auth/user-not-found') {
            Alert.alert('Login failed', 'The user cannot be found!');
          } else {
            Alert.alert('Login failed', errorMessage);
          }
        });
    },
    [googlePromptAsync]
  );

  const onLogout = useCallback(async () => {
    await myAuth.logout();
    await removeItem(storageKey.USER_ID_KEY);
    dispatch(logoutUser());
  }, [logoutUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, _ => {
      debug('useFirebaseAuth - onAuthStateChanged');
      setSetup(true);
    });

    return () => unsubscribe();
  }, []);

  return {
    setup,
    onAppleLogin,
    onGoogleLogin,
    onFacebookLogin,
    onEmailAndPasswordSignup,
    onEmailAndPasswordLogin,
    onLogout,
  };
};

export default useFirebaseAuth;
