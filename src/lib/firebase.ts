import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyApwDsko4ePWR0aFxqJVoTQivMlWO-T3aw",
    authDomain: "lovepage-304fb.firebaseapp.com",
    projectId: "lovepage-304fb",
    storageBucket: "lovepage-304fb.firebasestorage.app",
    messagingSenderId: "609826567191",
    appId: "1:609826567191:web:665b6a148e647bca861852",
    measurementId: "G-8SDH3NRZQK"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (typeof window !== 'undefined') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();

    googleProvider.setCustomParameters({
        prompt: 'select_account',
    });
}

export { app, auth, storage, googleProvider };