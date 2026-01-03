
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { auth, db, firebaseEnabled } from "./firebase";
import { User, LearningLog } from "../types";

export const backend = {
  // Auth
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    if (!firebaseEnabled || !auth) throw new Error("Firebase is not configured.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    const user = userCredential.user;
    return {
      id: user.uid,
      email: user.email!,
      name: name
    };
  },

  signIn: async (email: string, password: string): Promise<User> => {
    if (!firebaseEnabled || !auth) throw new Error("Firebase is not configured.");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      id: user.uid,
      email: user.email!,
      name: user.displayName || 'Learner'
    };
  },

  signOut: async () => {
    if (firebaseEnabled && auth) await firebaseSignOut(auth);
  },

  // Learning Logs
  saveLog: async (logData: Omit<LearningLog, 'id' | 'timestamp'>): Promise<LearningLog> => {
    if (!firebaseEnabled || !db) throw new Error("Firebase is not configured.");
    const logEntry = {
      ...logData,
      timestamp: Date.now(),
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "logs"), logEntry);
    
    return {
      ...logEntry,
      id: docRef.id
    };
  },

  getLogs: async (userId: string): Promise<LearningLog[]> => {
    if (!firebaseEnabled || !db) return [];
    
    try {
      const q = query(
        collection(db, "logs"), 
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const logs: LearningLog[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data as any
        });
      });
      
      return logs;
    } catch (error: any) {
      console.error("Firestore Error:", error);
      
      // Look for the index creation URL in the error message
      const indexMatch = error.message?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/);
      if (indexMatch) {
        console.error("MISSING INDEX URL:", indexMatch[0]);
        // We attach the URL to the error so the UI can display it
        error.indexUrl = indexMatch[0];
      }
      
      throw error;
    }
  }
};