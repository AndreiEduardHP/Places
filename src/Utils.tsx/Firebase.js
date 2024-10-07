import { initializeApp } from 'firebase/app'
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD02RRQZ1NHEst3CQvAm7Zfs-0oBwE4OFk',
  authDomain: 'places-4a48f.firebaseapp.com',
  projectId: 'places-4a48f',
  storageBucket: 'places-4a48f.appspot.com',
  messagingSenderId: '824380825967',
  appId: '1:824380825967:web:95640b31fadd881bd9489a',
  measurementId: 'G-DW392XXEVJ',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth with persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})

export { app, auth, firebaseConfig }
