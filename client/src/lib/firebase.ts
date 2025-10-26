import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Only initialize Firebase if API key is provided
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} else {
  console.warn('Firebase configuration missing. Firebase features will be unavailable.');
}

export { auth };
