// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "pantry-app-f80a6.firebaseapp.com",
  projectId: "pantry-app-f80a6",
  storageBucket: "pantry-app-f80a6.appspot.com",
  messagingSenderId: "237862940122",
  appId: "1:237862940122:web:fa11fd3c9841e9920424e3",
  measurementId: "G-6FWCPDR8S0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

// const analytics =
//   app.name && typeof window !== "undefined" ? getAnalytics(app) : null;

export { firestore };
