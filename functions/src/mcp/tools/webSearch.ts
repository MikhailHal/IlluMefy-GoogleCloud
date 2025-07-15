import {searchWeb} from "../../lib/search/braveSearch.js";

export interface WebSearchArgs {
    query: string;
}

interface WebSearchResult {
    content: Array<{
        type: string;
        text: string;
    }>;
    [key: string]: unknown;
}

/**
 * Web検索
 *
 * @param {WebSearchArgs} args 引数
 * @return {Promise<WebSearchResult>} 検索結果
 */
export async function executeWebSearch(args: WebSearchArgs): Promise<WebSearchResult> {
    const {query} = args;

    try {
        const results = await searchWeb(query);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        results: results,
                        query: query,
                        resultCount: results?.length || 0,
                    }, null, 2),
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: "Web search failed",
                        message: error instanceof Error ? error.message : String(error),
                    }, null, 2),
                },
            ],
        };
    }
}
