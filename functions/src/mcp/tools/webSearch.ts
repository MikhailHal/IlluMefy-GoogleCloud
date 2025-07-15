import {searchWeb} from "../../lib/search/braveSearch.js";

/**
 * Web検索
 *
 * @param {any} args 引数
 * @return {Promise<any>} 検索結果
 */
export async function executeWebSearch(args: any): Promise<any> {
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
