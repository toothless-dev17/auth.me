// Firebase configuration for your project
const firebaseConfig = {
  apiKey: "AIzaSyBFB4JAmfTuvLA4jJoqcsTkWb1WITXnOpU",
  authDomain: "bloomsky-techno.firebaseapp.com",
  projectId: "bloomsky-techno",
  storageBucket: "bloomsky-techno.firebasestorage.app",
  messagingSenderId: "311765720401",
  appId: "1:311765720401:web:73e3bcdad060818e9e0770",
  measurementId: "G-DW3Z2XSV4N"
};

// Initialize Firebase with compat CDN
let app;
let auth;
let analytics;

try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth(app);
  analytics = firebase.analytics(app);
  
  // Export auth instance for use in other scripts
  window.firebaseAuth = auth;
  console.log('Firebase initialized successfully with your project: bloomsky-techno');
} catch (error) {
  console.error('Firebase initialization error:', error);
}