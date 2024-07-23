// firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDK6l7L56LB6nkpTnqE_GK_-FqPE55QVUE',
  authDomain: 'places-a28da.firebaseapp.com',
  projectId: 'places-a28da',
  storageBucket: 'places-a28da.appspot.com',
  messagingSenderId: '471105680442',
  appId: '1:471105680442:web:844ff5c1f250a6e9e4b103',
  measurementId: 'G-98XG6SNW8N',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})

export { app, auth, firebaseConfig }
