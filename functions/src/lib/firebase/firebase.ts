import admin from "firebase-admin";
import {FirebaseConfigError} from "../../base/error/FirebaseConfigError";

try {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
} catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new FirebaseConfigError(
        `Firebase config initialization error. Detail: ${errorMessage}`
    );
}

export const db = admin.firestore();
export const auth = admin.auth();

export const Timestamp = admin.firestore.Timestamp;
export const FieldValue = admin.firestore.FieldValue;
