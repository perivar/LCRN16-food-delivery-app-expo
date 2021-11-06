import { initializeApp } from 'firebase/app';
import { CACHE_SIZE_UNLIMITED, initializeFirestore } from 'firebase/firestore';
import { LogBox } from 'react-native';

import { firebaseConfig } from '../config/firebase';
LogBox.ignoreLogs(['@firebase/firestore:']);

// Initialize Firebase
// console.log('initializing firebase app: ' + JSON.stringify(firebaseConfig));
console.log('Initializing firebase app');
const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  useFetchStreams: false,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
} as any);
