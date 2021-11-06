import dayjs from 'dayjs';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
} from 'firebase/auth';

import { getItem, removeItem, setItem, storageKey } from './storage';

const auth = getAuth();

const initFirebaseAuth = (): Promise<User | null> => {
  return new Promise(resolve => {
    var unsubscribe = onAuthStateChanged(auth, user => {
      // user Object resolve
      resolve(user);

      // unregister
      unsubscribe();
    });
  });
};

class Auth {
  // set session and store user uid and token information to async storage
  setSession = async (refresh = false) => {
    const user = await initFirebaseAuth();
    if (!user) {
      return null;
    }

    await setItem(storageKey.AUTH_UID_KEY, user.uid);

    const result = await user.getIdTokenResult(refresh);

    await setItem(storageKey.AUTH_ID_TOKEN_KEY, result.token);
    await setItem(
      storageKey.AUTH_ID_TOKEN_EXPIRATION_KEY,
      String(result.claims.exp)
    );

    return result.token;
  };

  // get the user token information from async storage
  getIdToken = async () => {
    const idToken = await getItem(storageKey.AUTH_ID_TOKEN_KEY);
    if (!idToken) {
      return null;
    }

    const expiration = await getItem(storageKey.AUTH_ID_TOKEN_EXPIRATION_KEY);

    if (Number(expiration) > dayjs().unix()) {
      return idToken;
    }

    return this.setSession(true);
  };

  getCurrentUser = () => auth.currentUser;

  // Notice Firebase automatically signs user in when their account is created
  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  doPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);

  doPasswordUpdate = async (password: string) => {
    if (this.getCurrentUser()) {
      await updatePassword(this.getCurrentUser(), password);
    }
    throw Error('Failed updating password - not current user!');
  };

  sendEmailVerification = () => sendEmailVerification(this.getCurrentUser());

  reload = () => this.getCurrentUser().reload();

  reauthenticate = (email: string, password: string) =>
    reauthenticateWithCredential(
      this.getCurrentUser(),
      EmailAuthProvider.credential(email, password)
    );

  // logout and remove user and token information from async storage
  logout = async () => {
    await signOut(auth);

    await removeItem(storageKey.AUTH_UID_KEY);
    await removeItem(storageKey.AUTH_ID_TOKEN_KEY);
    await removeItem(storageKey.AUTH_ID_TOKEN_EXPIRATION_KEY);
  };
}

export default Auth;
