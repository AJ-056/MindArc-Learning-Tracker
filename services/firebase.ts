
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Validated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeVjvx7QmYww39ChrFJUYWm6td4qeagwQ",
  authDomain: "linkup-lite-ng7wy.firebaseapp.com",
  databaseURL: "https://linkup-lite-ng7wy-default-rtdb.firebaseio.com",
  projectId: "linkup-lite-ng7wy",
  storageBucket: "linkup-lite-ng7wy.firebasestorage.app",
  messagingSenderId: "587126502108",
  appId: "1:587126502108:web:933d1ec21444375b39fa19"
};

const isConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" && 
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";

let auth: Auth | null = null;
let db: Firestore | null = null;
let firebaseEnabled = false;

if (isConfigValid) {
  try {
    let app: FirebaseApp;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    // Explicitly initialize services using the app instance
    auth = getAuth(app);
    db = getFirestore(app);
    firebaseEnabled = true;
    console.log("MindArc: Firebase connected.");
  } catch (error) {
    console.error("MindArc: Firebase failed to initialize:", error);
    firebaseEnabled = false;
  }
} else {
  console.warn("MindArc: Using fallback Local Demo Mode.");
}

export { auth, db, firebaseEnabled };