// ==============================================================
// CONFIGURACIÓN DE TU BASE DE DATOS FIREBASE
// ==============================================================

const firebaseConfig = {
  apiKey: "AIzaSyAR1JpUfIASLDI5OR8KR4u0_3W3mtwzh8A",
  authDomain: "sistema-registro-15a14.firebaseapp.com",
  projectId: "sistema-registro-15a14",
  storageBucket: "sistema-registro-15a14.firebasestorage.app",
  messagingSenderId: "1047672483244",
  appId: "1:1047672483244:web:a7ff705190e387e5f11e09",
  measurementId: "G-13FBCLNB9F"
};

// Comprobación rápida para saber si ya pegaste tus claves reales
function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "TU_API_KEY_AQUI" && firebaseConfig.projectId !== "TU_PROJECT_ID";
}

// Inicializar Firebase
if (typeof firebase !== "undefined" && isFirebaseConfigured()) {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
}
