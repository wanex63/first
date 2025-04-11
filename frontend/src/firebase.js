import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "ваш-api-key",
  authDomain: "ваш-project.firebaseapp.com",
  projectId: "ваш-project-id",
  storageBucket: "ваш-appspot.com",
  messagingSenderId: "ваш-sender-id",
  appId: "ваш-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;