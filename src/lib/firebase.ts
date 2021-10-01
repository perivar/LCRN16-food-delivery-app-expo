import firebase from './system/firebase';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
if (!firebase.apps.length) {
  // console.log('initializing firebase app: ' + JSON.stringify(firebaseConfig));
  console.log('Initializing firebase app');
  firebase.initializeApp(firebaseConfig);
}
