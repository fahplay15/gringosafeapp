import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFsKM3nO9kMqOfqNkUL5rW3ukS4yzzTzs",
  authDomain: "gringosafe-1f434.firebaseapp.com",
  projectId: "gringosafe-1f434",
  storageBucket: "gringosafe-1f434.firebasestorage.app",
  messagingSenderId: "949745647794",
  appId: "1:949745647794:web:e81698e40bd8d7aa5d09ab"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Banco de Dados e a Autenticação para usarmos no app inteiro
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();