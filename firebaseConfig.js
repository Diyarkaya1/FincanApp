import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Yeni importlar
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCbHFkmLHVukeZ-V68K7cSXjwK4L4sS8Ng",
  authDomain: "fincanapp-74fb7.firebaseapp.com",
  projectId: "fincanapp-74fb7",
  storageBucket: "fincanapp-74fb7.firebasestorage.app",
  messagingSenderId: "982351480251",
  appId: "1:982351480251:web:e825f6d215fe0db946f09e",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Auth'u kalıcı hafıza ile başlatıyoruz
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);