import {InternalServerError} from "../../base/error/InternalServerError";

const TAG = "Brave Search API";

let apiKey = "";

/**
 * Brave Search APIの初期化
 *
 * @param {string} key APIキー
 */
export function initializeBraveSearch(key: string) {
    apiKey = key;
    console.log(`[${TAG}] - Succeed to initialize the instance!`);
}

/**
 * Web検索実行
 *
 * @param {string} query 検索クエリ
 * @return {Promise<any>} 検索結果
 */
export async function searchWeb(query: string): Promise<any> {
    if (!apiKey) {
        throw new InternalServerError(`[${TAG}] - API key not initialized`);
    }

    try {
        const response = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
            {
                headers: {
                    "Accept": "application/json",
                    "X-Subscription-Token": apiKey,
                },
            }
        );

        if (!response.ok) {
            throw new InternalServerError(
                `[${TAG}] - Search failed: ${response.statusText}`
            );
        }

        const data = await response.json();
        return data.web.results;
    } catch (error) {
        console.error(`[${TAG}] - Error during web search:`, error);
        throw new InternalServerError(
            `[${TAG}] - Failed to perform web search`
        );
    }
}
