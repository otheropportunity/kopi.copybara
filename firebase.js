// === Firebase Configuration ===
const firebaseConfig = {
  apiKey: "AIzaSyAWZg7mZe1j2Nwkg5JvPUjf_bdCvfWvN9g",
  authDomain: "kopi-copybara.firebaseapp.com",
  databaseURL: "https://kopi-copybara-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ Add this manually
  projectId: "kopi-copybara",
  storageBucket: "kopi-copybara.firebasestorage.app",
  messagingSenderId: "729875984861",
  appId: "1:729875984861:web:6b1ea2d44f8789c18e4634"
};

// === Initialize Firebase ===
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
