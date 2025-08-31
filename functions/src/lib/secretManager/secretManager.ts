import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {InternalServerError} from "../../base/error/InternalServerError";
import admin from "firebase-admin";

const TAG = "Secret Manager";
const client = new SecretManagerServiceClient();

/**
 * シークレット取得
 *
 * @param {string} secretName シークレットキー名
 * @return {string} キーに対応するバリュー
 */
export async function getSecret(secretName:string): Promise<string> {
    try {
        console.log(`[${TAG}] - Start to fetch ${secretName} value info`);
        const projectId = admin.app().options.projectId;
        const secretPath = `projects/${projectId}/secrets/${secretName}/versions/latest`;
        const [version] = await client.accessSecretVersion({
            name: secretPath,
        });
        const secretValue = version.payload?.data?.toString();
        if (!secretValue) {
            throw new Error("Secret value is empty");
        }
        console.log(`[${TAG}] - Succeed to fetch ${secretName} value info`);
        return secretValue;
    } catch (error) {
        console.log(`[${TAG}] - Failed to fetch ${secretName} value info`);
        throw new InternalServerError(`Failed to get secret ${secretName}: ${error}`);
    }
}
