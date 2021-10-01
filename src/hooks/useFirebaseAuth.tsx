import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import { ResponseType } from 'expo-auth-session';
import firebase from '../lib/system/firebase';
import '../lib/firebase';
import { storageKey, removeItem } from '../lib/storage';
import Auth from '../lib/auth';
import { useAppDispatch } from '../redux/store/hooks';
import { loginUser, logoutUser, User } from '../redux/slices/auth';

const auth = new Auth();

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

const useFirebaseAuth = (errorCallback?: () => void) => {
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
      const idToken = await auth.setSession(refresh);
      debug('useFirebaseAuth - setSession idToken:', idToken);
      return idToken;
    },
    [auth.setSession]
  );

  const firebaseLogin = useCallback(
    async (credential: firebase.auth.OAuthCredential) => {
      debug('useFirebaseAuth - firebaseLogin - credential:', credential);
      const data = await firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => {
          console.log(error);
          Alert.alert('Login failed. ' + error);
        });

      if (data) {
        debug('useFirebaseAuth - firebaseLogin - data.user:', data.user);
        const providerUser = data.user.providerData[0];
        const user: User = {
          uid: providerUser.uid,
          displayName: providerUser.displayName,
          email: providerUser.email,
        };
        dispatch(loginUser(user));
      }

      return await setSession(true);
    },
    [setSession]
  );

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      debug('useFirebaseAuth - googleResponse - id_token:', id_token);
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      firebaseLogin(credential);
    } else if (googleResponse?.type === 'error') {
      console.log('google response error:', googleResponse);
      Alert.alert('Login failed. ' + googleResponse);
      errorCallback?.();
    }
  }, [googleResponse, firebaseLogin, errorCallback]);

  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { access_token } = facebookResponse.params;
      debug('useFirebaseAuth - facebookResponse - access_token:', access_token);
      const credential =
        firebase.auth.FacebookAuthProvider.credential(access_token);
      firebaseLogin(credential);
    } else if (facebookResponse?.type === 'error') {
      console.log('facebook response error:', facebookResponse);
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

      const provider = new firebase.auth.OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: result.identityToken || '',
        rawNonce: nonce,
      });

      firebaseLogin(credential);
    } catch (error) {
      console.log('error:', error);
      Alert.alert('Login failed. ' + error);
    }
  }, [firebaseLogin]);

  const onEmailAndPasswordSignup = useCallback(
    (email: string, password: string) => {
      auth
        .doCreateUserWithEmailAndPassword(email, password)
        .then(() => {
          // Notice Firebase automatically signs user in when their account is created
          // so dispatch loginUser is not needed
        })
        .catch((error: any) => {
          console.log(error);
          Alert.alert('Login failed. ' + error);
        });
    },
    [googlePromptAsync]
  );

  const onEmailAndPasswordLogin = useCallback(
    (email: string, password: string) => {
      auth
        .doSignInWithEmailAndPassword(email, password)
        .then(data => {
          const providerUser = data.user.providerData[0];
          const user: User = {
            uid: providerUser.uid,
            displayName: providerUser.displayName,
            email: providerUser.email,
          };
          dispatch(loginUser(user));
        })
        .catch(error => {
          console.log(error);
          Alert.alert('Login failed. ' + error);
        });
    },
    [googlePromptAsync]
  );

  const onLogout = useCallback(async () => {
    await auth.logout();
    await removeItem(storageKey.USER_ID_KEY);
    dispatch(logoutUser());
  }, [logoutUser]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
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
