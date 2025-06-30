import * as admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();

export const TimeStamp = admin.firestore.Timestamp;
export const FieldValue = admin.firestore.FieldValue;
