// plugins/firebase.client.js
import { defineNuxtPlugin } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAPH5k7RrfL5mSSPFeXDDVfM6CbQrSZggg",
    authDomain: "coba-coba-dfc0d.firebaseapp.com",
    databaseURL: "https://coba-coba-dfc0d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "coba-coba-dfc0d",
    storageBucket: "coba-coba-dfc0d.appspot.com",
    messagingSenderId: "1012912028736",
    appId: "1:1012912028736:web:930c38e397b5717a41b3a5",
    measurementId: "G-QEPGG3BWG1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  return {
    provide: {
      firebase: {
        auth,
        provider,
        signInWithPopup
      }
    }
  };
});
