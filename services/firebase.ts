import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * Firebase configuration is now pulled from environment variables.
 * This ensures credentials are not hardcoded in the source code.
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const isConfigValid = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" && 
  firebaseConfig.apiKey !== "undefined";

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
  console.warn("MindArc: Firebase environment variables missing. Using fallback Local Demo Mode.");
}

export { auth, db, firebaseEnabled };