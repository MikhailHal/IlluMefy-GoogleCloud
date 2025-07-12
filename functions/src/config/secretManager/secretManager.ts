import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {InternalServerError} from "../../base/error/InternalServerError";

const client = new SecretManagerServiceClient();

/**
 * シークレット取得
 *
 * @param {string} secretName シークレットキー名
 * @return {string} キーに対応するバリュー
 */
export async function getSecret(secretName:string): Promise<string> {
    try {
        const secretPath = `projects/405184515768/secrets/${secretName}/versions/latest`;
        const [version] = await client.accessSecretVersion({
            name: secretPath,
        });
        const secretValue = version.payload?.data?.toString();
        if (!secretValue) {
            throw new Error("Secret value is empty");
        }
        return secretValue;
    } catch (error) {
        console.error("Secret Manager error:", error);
        throw new InternalServerError(`Failed to get secret ${secretName}: ${error}`);
    }
}
