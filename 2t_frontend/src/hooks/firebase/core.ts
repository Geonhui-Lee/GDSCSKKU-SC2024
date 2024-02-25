import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "data/config";

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
setPersistence(firebaseAuth, browserLocalPersistence);

export const firestore = getFirestore(app);
export const firebaseStorage = getStorage(app);