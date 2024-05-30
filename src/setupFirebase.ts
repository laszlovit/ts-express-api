import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: 'fake-api-key',
  authDomain: 'localhost',
  projectId: process.env.FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  firebase
    .auth()
    .useEmulator(`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
}
