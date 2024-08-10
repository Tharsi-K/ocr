// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tamil-ocr-bd972.firebaseapp.com",
  projectId: "tamil-ocr-bd972",
  storageBucket: "tamil-ocr-bd972.appspot.com",
  messagingSenderId: "935932788059",
  appId: "1:935932788059:web:5e4f1e06b6b4d3b2886e7e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);