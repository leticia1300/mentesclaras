import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWAFcOuD7vpsb4gJykiRUow3eeglA1RBo",
    authDomain: "test456-acf50.firebaseapp.com",
    databaseURL: "https://test456-acf50-default-rtdb.firebaseio.com",
    projectId: "test456-acf50",
    storageBucket: "test456-acf50.firebasestorage.app",
    messagingSenderId: "493741273430",
    appId: "1:493741273430:web:e540e09fda75349b5ae6f7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set, get };