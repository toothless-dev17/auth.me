// Firebase configuration - REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE PROJECT CREDENTIALS
// You can find these in your Firebase Console > Project Settings > Add app > Web app
const firebaseConfig = {
    apiKey: "AIzaSyBFB4JAmfTuvLA4jJoqcsTkWb1WITXnOpU",
    authDomain: "bloomsky-techno.firebaseapp.com",
    projectId: "bloomsky-techno",
    storageBucket: "bloomsky-techno.firebasestorage.app",
    messagingSenderId: "311765720401",
    appId: "1:311765720401:web:73e3bcdad060818e9e0770",
    measurementId: "G-DW3Z2XSV4N"
};

// Initialize Firebase
let app;
let auth;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Export auth instance for use in other scripts
window.firebaseAuth = auth;