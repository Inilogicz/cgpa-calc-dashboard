// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6TuWB3QaOC1Gtxot4IqWNFCYR_QRAHcE",
    authDomain: "cgpa-calculator-97430.firebaseapp.com",
    projectId: "cgpa-calculator-97430",
    storageBucket: "cgpa-calculator-97430.appspot.com",
    messagingSenderId: "945044547837",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Auth

// Export necessary functionalities
export { firebaseConfig, db, auth, onAuthStateChanged }; // Include onAuthStateChanged
