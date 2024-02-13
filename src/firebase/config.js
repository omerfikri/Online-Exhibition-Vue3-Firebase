import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAyltMd-zBdBT1-sQKv42DGf7a-sW2tyOI",
  authDomain: "blog-ee06b.firebaseapp.com",
  projectId: "blog-ee06b",
  storageBucket: "blog-ee06b.appspot.com",
  messagingSenderId: "117542492649",
  appId: "1:117542492649:web:89cf333456387680651378",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();
const timestamp = serverTimestamp();
const storageRef = getStorage();

export { db, timestamp, auth, storageRef };
