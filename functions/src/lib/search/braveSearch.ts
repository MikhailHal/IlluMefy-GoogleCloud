import {InternalServerError} from "../../base/error/InternalServerError";
import {getSecret} from "../secretManager/secretManager";

const TAG = "Brave Search API";

interface BraveSearchResult {
    title: string;
    url: string;
    description: string;
}

let apiKey = "";
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

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
 * @return {Promise<BraveSearchResult[]>} 検索結果
 */
export async function searchWeb(query: string): Promise<BraveSearchResult[]> {
    // APIキーが初期化されていない場合は自動初期化
    if (!apiKey && !isInitializing) {
        isInitializing = true;
        initializationPromise = (async () => {
            try {
                const key = await getSecret("brave-search-api-key");
                initializeBraveSearch(key);
                console.log(`[${TAG}] - Auto-initialized from searchWeb`);
            } catch (error) {
                isInitializing = false;
                throw new InternalServerError(`[${TAG}] - Failed to auto-initialize`);
            }
        })();
    }
    // 初期化中の場合は待機
    if (initializationPromise) {
        await initializationPromise;
    }

    if (!apiKey) {
        throw new InternalServerError(`[${TAG}] - API key not initialized`);
    }

    // クエリの検証
    if (!query || query.trim().length === 0) {
        throw new InternalServerError(`[${TAG}] - Search query is required`);
    }

    try {
        const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query.trim())}`;
        const headers = {
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
            "X-Subscription-Token": apiKey,
        };

        console.log(`[${TAG}] - Making request to:`, url);
        console.log(`[${TAG}] - Headers:`, {...headers, "X-Subscription-Token": "***"});

        const response = await fetch(url, {headers});

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[${TAG}] - API Response Error:`, {
                status: response.status,
                statusText: response.statusText,
                errorText: errorText,
            });
            throw new InternalServerError(
                `[${TAG}] - Search failed: ${response.status} ${response.statusText} - ${errorText}`
            );
        }

        const data = await response.json();
        console.log(`[${TAG}] - Response structure:`, JSON.stringify(data, null, 2));

        // レスポンス構造の検証
        if (!data || !data.web || !Array.isArray(data.web.results)) {
            console.error(`[${TAG}] - Unexpected response structure:`, data);
            throw new InternalServerError(`[${TAG}] - Unexpected API response structure`);
        }

        return data.web.results.map((result: {title?: string; url?: string; description?: string}) => ({
            title: result.title || "",
            url: result.url || "",
            description: result.description || "",
        }));
    } catch (error) {
        console.error(`[${TAG}] - Error during web search:`, error);
        if (error instanceof InternalServerError) {
            throw error;
        }
        throw new InternalServerError(
            `[${TAG}] - Failed to perform web search: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
