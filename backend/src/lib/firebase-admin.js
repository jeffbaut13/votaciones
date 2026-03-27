import admin from "firebase-admin";
import { env } from "../config/env.js";

let db = null;

export function getDb() {
  if (db) return db;

  if (admin.apps.length === 0) {
    // En Cloud Functions / Cloud Run las credenciales se proveen automaticamente
    // mediante la cuenta de servicio del proyecto (K_SERVICE lo indica)
    const isCloudEnv = Boolean(process.env.K_SERVICE || process.env.FUNCTION_TARGET);

    if (isCloudEnv) {
      admin.initializeApp();
    } else {
      if (!env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) {
        throw new Error("Las credenciales de Firebase no estan configuradas.");
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.firebaseProjectId,
          clientEmail: env.firebaseClientEmail,
          privateKey: env.firebasePrivateKey,
        }),
      });
    }
  }

  db = admin.firestore();
  return db;
}
