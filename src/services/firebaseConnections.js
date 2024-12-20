import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDvRpX0NHj-9M2-2nPnOs7XtsCo00j5jWk",
    authDomain: "void-project-ccce9.firebaseapp.com",
    projectId: "void-project-ccce9",
    storageBucket: "void-project-ccce9.firebasestorage.app",
    messagingSenderId: "100071963214",
    appId: "1:100071963214:web:e938567631ced716cea11f"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export { auth, db, storage };