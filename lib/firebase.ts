import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAiXOHc6AwUHFce3icFxkpe7M_bGBf13hc',
  authDomain: 'apsara-talent-39caa.firebaseapp.com',
  projectId: 'apsara-talent-39caa',
  storageBucket: 'apsara-talent-39caa.appspot.com',
  messagingSenderId: '1064024662265',
  appId: '1:1064024662265:web:ef886f18ed5f4ad64e8228',
  measurementId: 'G-WNVRSLDRW9',
};

// Only initialize if not already done
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };