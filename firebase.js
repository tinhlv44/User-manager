// Import các module cần thiết từ Firebase SDK v9 trở lên
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDicxgSWEfcnw2sHCp7eJyCXm9mbQeF1JI",
  authDomain: "fir-login-7b798.firebaseapp.com",
  projectId: "fir-login-7b798",
  storageBucket: "fir-login-7b798.appspot.com",
  messagingSenderId: "7484503944",
  appId: "1:7484503944:web:f6db15222a5efc2e7dac3d",
  measurementId: "G-2WCVPCLRZT"
};
// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

export { db };



