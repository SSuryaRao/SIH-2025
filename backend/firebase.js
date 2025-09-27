import admin from "firebase-admin";
import { createRequire } from "module";

// Use environment variables in production, fallback to local file in development
let firebaseConfig;

if (process.env.NODE_ENV === 'production') {
  // Production: Use environment variables
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  // Handle both escaped newlines (\n) and actual newlines
  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  firebaseConfig = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };
} else {
  // Development: Use local service account file
  const require = createRequire(import.meta.url);
  firebaseConfig = require("./firebase-service-account.json");
}

if (!admin.apps.length) {
  try {
    // Validate required fields
    if (!firebaseConfig.project_id || !firebaseConfig.private_key || !firebaseConfig.client_email) {
      console.error('Missing required Firebase configuration:', {
        project_id: !!firebaseConfig.project_id,
        private_key: !!firebaseConfig.private_key,
        client_email: !!firebaseConfig.client_email
      });
      throw new Error('Missing required Firebase configuration');
    }

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || firebaseConfig.project_id + '.appspot.com'
    });
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };
export default db;
