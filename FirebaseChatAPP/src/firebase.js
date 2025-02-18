// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);