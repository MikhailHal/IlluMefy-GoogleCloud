import admin, {ServiceAccount} from "firebase-admin";
import {InternalServerError} from "../../base/error/InternalServerError";
import {FirebaseConfigError} from "../../base/error/FirebaseConfigError";

const requiredEnvVars = [
    "FIREBASE_ADMIN_PROJECT_ID",
    "FIREBASE_ADMIN_PRIVATE_KEY",
    "FIREBASE_ADMIN_CLIENT_EMAIL",
];

// 必要な情報がenvファイルに含まれていることを確認
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new InternalServerError();
    }
}

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key:
        process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
        process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount),
        });
    }
} catch (error) {
    throw new FirebaseConfigError(
        "Firebase config initialization error .In detail: ${error.message}"
    );
}

export const db = admin.firestore();
export const auth = admin.auth();

export const Timestamp = admin.firestore.Timestamp;
export const FieldValue = admin.firestore.FieldValue;
