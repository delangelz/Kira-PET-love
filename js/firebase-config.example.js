// ==============================================================
// PLANTILLA DE CONFIGURACIÓN DE FIREBASE (PARA SUBIR A GITHUB)
// ==============================================================
// Este archivo sirve como muestra para GitHub. Así no expones tus
// claves privadas si compartes tu código en un repositorio público.

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
if (typeof firebase !== "undefined") {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
}
