import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCw79nXFbkQr6WYydMUIUYDmD000a83JdA",
  authDomain: "suboptimize.firebaseapp.com",
  projectId: "suboptimize",
  storageBucket: "suboptimize.firebasestorage.app",
  messagingSenderId: "948898609821",
  appId: "1:948898609821:web:45614c6be9adafa4f07274",
  measurementId: "G-MRZEKXZHGC"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app)

export { app, auth };