
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Validated Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
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
