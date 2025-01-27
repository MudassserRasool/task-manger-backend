import admin from 'firebase-admin';
import fs from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Load the service account key using ES module syntax
const serviceAccountPath = join(__dirname, '../data/keys/firebase-admin.json');
const serviceAccount = JSON.parse(
  await fs.readFile(serviceAccountPath, 'utf8')
);
console.log(serviceAccount);
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
