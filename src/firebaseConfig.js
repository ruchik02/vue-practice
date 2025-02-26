import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAh1bfgIWmLmdzCuwpDyXeDl1YAGWcFE2s",
    authDomain: "vue-project-1c2ba.firebaseapp.com",
    projectId: "vue-project-1c2ba",
    storageBucket: "vue-project-1c2ba.firebasestorage.app",
    messagingSenderId: "426404837341",
    appId: "1:426404837341:web:31f6e5110768a944e42834",
    measurementId: "G-7WPBTFWM7J"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };