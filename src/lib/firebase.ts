import firebase from './system/firebase';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
if (!firebase.apps.length) {
  // console.log('initializing firebase app: ' + JSON.stringify(firebaseConfig));
  console.log('Initializing firebase app');
  firebase.initializeApp(firebaseConfig);
}

/*
export const auth = firebase.auth();
export const db = firebase.firestore();

// https://github.com/diegocasmo/expo-firebase-authentication
// https://github.com/morizyun/react-typescript-firebase-auth/blob/master/src/firebase/auth.ts
export const getUser = (): firebase.User => auth.currentUser;

// Notice Firebase automatically signs user in when their account is created
export const doCreateUserWithEmailAndPassword = (
  email: string,
  password: string
) => auth.createUserWithEmailAndPassword(email, password);

export const doSignInWithEmailAndPassword = (email: string, password: string) =>
  auth.signInWithEmailAndPassword(email, password);

export const doSignOut = () => auth.signOut();

export const doPasswordReset = (email: string) =>
  auth.sendPasswordResetEmail(email);

export const doPasswordUpdate = async (password: string) => {
  if (getUser()) {
    await getUser().updatePassword(password);
  }
  throw Error('Failed updating password - not currentUser!');
};

export const sendEmailVerification = () => getUser().sendEmailVerification();

export const reload = () => getUser().reload();

export const reauthenticate = (email: string, password: string) =>
  getUser().reauthenticateWithCredential(
    firebase.auth.EmailAuthProvider.credential(email, password)
  );
*/
