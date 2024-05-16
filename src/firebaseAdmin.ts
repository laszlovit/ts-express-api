import * as admin from 'firebase-admin';

require('dotenv').config();

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountEnv) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountEnv, 'base64').toString('utf-8'),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
