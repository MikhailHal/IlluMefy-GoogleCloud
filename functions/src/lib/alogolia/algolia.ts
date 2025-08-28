import {algoliasearch, Algoliasearch} from "algoliasearch";
import {InternalServerError} from "../../base/error/InternalServerError";

const TAG = "Algolia";

let algolia: Algoliasearch;

/**
 * Algolia初期化
 * @param {string} appId アプリケーションId
 * @param {string} writeApiKey 書き込み可能APIキー
 */
export function initializeAlgolia(appId: string, writeApiKey: string) {
    algolia = algoliasearch(appId, writeApiKey);
    console.log(`[${TAG}] - Succeed to initialize the instance!`);
}

/**
 * 書き込み処理
 * @param {string} indexName インデックス名
 * @param {string} objectId オブジェクト名
 * @param {T} payload 書き込みデータ
 */
export async function write<T extends Record<string, any>>(
    indexName: string,
    objectId: string,
    payload: T
): Promise<void> {
    if (!algolia) {
        throw new InternalServerError(`[${TAG}] - API key not initialized`);
    }
    const rawPayload = {
        ...payload,
        objectID: objectId,
    };
    try {
        await algolia.saveObject({indexName, body: rawPayload});
        console.log(`[${TAG}] - Succeed to write data✅ !`);
    } catch (error) {
        console.error(`[${TAG}] - Failed to write object: ${objectId}`, error);
        throw new InternalServerError(`[${TAG}] - Failed to write to Algolia: ${error}`);
    }
}

/**
 * インデックス削除処理
 * @param {string} indexName インデックス名
 */
export async function deleteIndex(indexName: string): Promise<void> {
    if (!algolia) {
        throw new InternalServerError(`[${TAG}] - API key not initialized`);
    }
    try {
        await algolia.deleteIndex({indexName});
        console.log(`[${TAG}] - Succeed to delete index: ${indexName}✅`);
    } catch (error) {
        console.error(`[${TAG}] - Failed to delete index: ${indexName}`, error);
        throw new InternalServerError(`[${TAG}] - Failed to delete index: ${error}`);
    }
}
