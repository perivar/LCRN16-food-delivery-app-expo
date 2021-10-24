import { LogBox } from 'react-native';

import { firebaseConfig } from '../config/firebase';
import firebase from './system/firebase';
LogBox.ignoreLogs(['@firebase/firestore:']);

// Initialize Firebase
if (!firebase.apps.length) {
  // console.log('initializing firebase app: ' + JSON.stringify(firebaseConfig));
  console.log('Initializing firebase app');
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({
    // @ts-ignore
    useFetchStreams: false,
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  });
}
