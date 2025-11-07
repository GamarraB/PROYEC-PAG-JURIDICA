// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Tu configuración de Firebase (reemplaza con la tuya)
const firebaseConfig = {
    apiKey: "AIzaSyBz-qMcOT2zSGr8ZbGpC00NFNKlj2oMxac",
    authDomain: "pagina-derecho.firebaseapp.com",
    projectId: "pagina-derecho",
    storageBucket: "pagina-derecho.firebasestorage.app",
    messagingSenderId: "259841486103",
    appId: "1:259841486103:web:ead6289890996e7e12db52",
    measurementId: "G-G3JS63M4WG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hacer db y funciones globales disponibles
window.db = db;
window.collection = collection;
window.getDocs = getDocs;
window.getDoc = getDoc;
window.addDoc = addDoc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;
window.query = query;
window.orderBy = orderBy;
window.limit = limit;
window.where = where;

// Firebase ready flag
window.firebaseReady = false;

// Mark Firebase as ready
setTimeout(() => {
    window.firebaseReady = true;
    console.log('Firebase initialized successfully');
}, 100);

// Exportar para uso en otros módulos si es necesario
export { db, collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where };
