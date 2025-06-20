// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-3uIKB6FWMewC90fuubT87tuLagp5B6c",
  authDomain: "fk-bookstore-84783.firebaseapp.com",
  projectId: "fk-bookstore-84783",
  storageBucket: "fk-bookstore-84783.appspot.com",
  messagingSenderId: "317311257529",
  appId: "1:317311257529:web:4a3fe3a9acc89cce56c468"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;