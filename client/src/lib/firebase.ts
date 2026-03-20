import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6_wdcUX3gprjOO0n7gyrf4cT4H2Iqnx8",
  authDomain: "baraka-today.firebaseapp.com",
  projectId: "baraka-today",
  storageBucket: "baraka-today.firebasestorage.app",
  messagingSenderId: "356244506722",
  appId: "1:356244506722:web:b78b1882f3f0e01369693b",
  measurementId: "G-9VRNZ2L7PH",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
