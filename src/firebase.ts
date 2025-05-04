import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3WLHEstMapKajeSl9-FSovYiaUWwLo7c",
  authDomain: "viguard-b267b.firebaseapp.com",
  projectId: "viguard-b267b",
  storageBucket: "viguard-b267b.firebasestorage.app",
  messagingSenderId: "7022171745",
  appId: "1:7022171745:web:2068cce5c89c6d0ece3c20",
  measurementId: "G-57JZY1KMSK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Export auth functions
export const createUser = createUserWithEmailAndPassword;
export const signIn = signInWithEmailAndPassword;
export const logout = signOut;

// Get the current user's ID token
export const getCurrentUserIdToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is signed in');
  }
  return user.getIdToken(true);
};
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};