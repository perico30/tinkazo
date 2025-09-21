import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt3CsX4D38GEM45U-p1DCPCxowGbx3dmw",
  authDomain: "tinkazo-4f018.firebaseapp.com",
  projectId: "tinkazo-4f018",
  storageBucket: "tinkazo-4f018.firebasestorage.app",
  messagingSenderId: "162745810322",
  appId: "1:162745810322:web:02346591ba74b2177d554b",
  measurementId: "G-D1Z3373707"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn('Firebase persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence.
      console.warn('Firebase persistence is not available in this browser.');
    }
  });


export { db };
