// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
// //   apiKey: "AIzaSyBxTXtXGsGwFpcVOa4__QQCrXsCCuAOvBY",
// //   authDomain: "commentproject-db732.firebaseapp.com",
// //   projectId: "commentproject-db732",
// //   storageBucket: "commentproject-db732.appspot.com",
// //   messagingSenderId: "286915854032",
// //   appId: "1:286915854032:web:1cf4a88b7d3e57639668d5",
// //   measurementId: "G-456454NCMX",

// };

const firebaseConfig = {
  apiKey: "AIzaSyDN3V6vguDLw10u6E-LoYUiEISwqTLTw8w",
  authDomain: "commentproject-af8c6.firebaseapp.com",
  projectId: "commentproject-af8c6",
  storageBucket: "commentproject-af8c6.appspot.com",
  messagingSenderId: "804675261814",
  appId: "1:804675261814:web:737af91001d6c9fd639657",
  measurementId: "G-N50V0H45WQ",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
