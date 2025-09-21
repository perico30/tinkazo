// FIX: Updated Firebase initialization to use the v8 compat libraries. This resolves the 'initializeApp' export error by ensuring the v8 namespaced API is available.
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

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

// Initialize Firebase, checking if it's already initialized.
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
const db = app.firestore();

// NOTE: La persistencia offline ha sido deshabilitada para diagnosticar problemas de guardado.
// Ahora los errores de escritura (ej. reglas de seguridad) se mostrarán inmediatamente.
// Para reactivar, descomenta este bloque y añade 'enableIndexedDbPersistence' a la importación de 'firebase/firestore'.
/*
import { enableIndexedDbPersistence } from "firebase/firestore";
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
*/


export { db };