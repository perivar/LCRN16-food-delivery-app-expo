import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import { ResponseType } from 'expo-auth-session';
import firebase from '../lib/system/firebase';
import '../lib/firebase';
import { storageKey, getItem, removeItem } from '../lib/storage';
import Auth from '../lib/auth';
import { useAppDispatch } from '../redux/store/hooks';
import { loginUser, logoutUser, User } from '../redux/slices/auth';

type AuthUser = {
  uid: string | null;
};

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
  const [authUser, setAuthUser] = useState<AuthUser>();
  const [setup, setSetup] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    responseType: ResponseType.IdToken,
    expoClientId: Constants.manifest.extra.expoGoogleClientId,
  });

  useEffect(() => {
    debug('useIdTokenAuthRequest request:', request);
  }, [request]);

  useEffect(() => {
    debug('useIdTokenAuthRequest response:', response);
  }, [response]);

  const onGoogleLogin = useCallback(() => {
    promptAsync();
  }, [promptAsync]);

  const setSession = useCallback(
    async (refresh = false) => {
      debug('setSession started ...');
      const idToken = await auth.setSession(refresh);
      debug('setSession idToken: ', idToken);

      if (idToken) {
        const authUID = await getItem(storageKey.AUTH_UID_KEY);
        debug('setSession authUID:', authUID);
        setAuthUser({
          uid: authUID,
        });
      }

      return idToken;
    },
    [auth.setSession]
  );

  const firebaseLogin = useCallback(
    async (credential: firebase.auth.OAuthCredential) => {
      debug('firebaseLogin - credential: ', credential);
      const data = await firebase
        .auth()
        .signInWithCredential(credential)
        .catch((error: any) => {
          console.log(error);
        });

      if (data) {
        debug('firebaseLogin - data.user: ', data.user);
        const user: User = {
          uid: data.user.uid,
          displayName: data.user.displayName,
          email: data.user.email,
        };
        dispatch(loginUser(user));
      }

      return await setSession(true);
    },
    [setSession]
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      debug('id_token: ', id_token);
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      firebaseLogin(credential);
    } else if (response?.type === 'error') {
      console.log('error:', response);
      Alert.alert('Login failed');
      errorCallback?.();
    }
  }, [response, firebaseLogin, errorCallback]);

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
      debug('apple result:', result);

      const provider = new firebase.auth.OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: result.identityToken || '',
        rawNonce: nonce,
      });

      firebaseLogin(credential);
    } catch (e) {
      console.log('error:', e);
      Alert.alert('Login failed');
    }
  }, [firebaseLogin]);

  const onLogout = useCallback(async () => {
    await auth.logout();
    await removeItem(storageKey.USER_ID_KEY);
    dispatch(logoutUser());
  }, [logoutUser]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      debug('onAuthStateChanged ...');
      setSetup(true);
    });

    return () => unsubscribe();
  }, []);

  return {
    setup,
    authUser,
    onAppleLogin,
    onGoogleLogin,
    onLogout,
  };
};

export default useFirebaseAuth;
