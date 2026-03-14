import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYBagRtBIoC7HpqUtO2OgBctny6T-Y4Dw",
  authDomain: "smart-recipe-ai-fd691.firebaseapp.com",
  projectId: "smart-recipe-ai-fd691",
  storageBucket: "smart-recipe-ai-fd691.firebasestorage.app",
  messagingSenderId: "594547764947",
  appId: "1:594547764947:web:eaa8a538c7edf538962e26"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;