// require("dotenv").config();
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9ZQW-t3sy0zMVD7_vWcSLjVI87Qu9EZk",
  authDomain: "accounting-app-9e557.firebaseapp.com",
  projectId: "accounting-app-9e557",
  storageBucket: "accounting-app-9e557.appspot.com",
  messagingSenderId: "141964990774",
  appId: "1:141964990774:web:70a1cc863dadbb881b7b97",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default { app, db, auth };
