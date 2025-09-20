import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };
