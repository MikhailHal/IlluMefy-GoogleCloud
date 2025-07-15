import Anthropic from "@anthropic-ai/sdk";
import {InternalServerError} from "../../base/error/InternalServerError";

const TAG = "Anthropic API";

let anthropic: Anthropic;

/**
 * Anthropic APIの初期化
 *
 * @param {string} key APIキー
 */
export function initializeAnthropic(key: string) {
    anthropic = new Anthropic({apiKey: key});
    console.log(`[${TAG}] - Succeed to initialize the instance!`);
}

/**
 * MCPサーバーとの統合処理
 *
 * @param {string} mcpServerUrl MCPサーバーのURL
 * @param {string} query 検索クエリ
 * @return {Promise<string>} Anthropicからの応答
 */
export async function processMCPIntegration(mcpServerUrl: string, query: string): Promise<string> {
    if (!anthropic) {
        console.error(`[${TAG}] - API key not initialized`);
        throw new InternalServerError(`[${TAG}] - API key not initialized`);
    }

    try {
        // MCPサーバーからツールリストを取得
        const toolsResponse = await fetch(`${mcpServerUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "tools/list",
                params: {},
            }),
        });

        const toolsData = await toolsResponse.json();
        console.log(`[${TAG}] - Available tools:`, toolsData.result.tools);

        // Web検索を実行
        const searchResponse = await fetch(`${mcpServerUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 2,
                method: "tools/call",
                params: {
                    name: "web_search",
                    arguments: {query},
                },
            }),
        });

        const searchData = await searchResponse.json();
        const searchResults = JSON.parse(searchData.result.content[0].text);

        // Anthropic APIにWeb検索結果を基に質問（リトライ付き）
        let message;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                message = await anthropic.messages.create({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1000,
                    messages: [
                        {
                            role: "user",
                            content: `以下のWeb検索結果を基に、「${query}」について簡潔に説明してください。

検索結果:
${JSON.stringify(searchResults, null, 2)}`,
                        },
                    ],
                });
                break;
            } catch (error: unknown) {
                retryCount++;
                if ((error as {status?: number}).status === 529 && retryCount < maxRetries) {
                    console.log(`[${TAG}] - Retry ${retryCount}/${maxRetries} after overload error`);
                    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // 指数バックオフ
                } else {
                    throw error;
                }
            }
        }

        if (!message) {
            throw new InternalServerError(`[${TAG}] - Failed to get response after ${maxRetries} retries`);
        }

        const response = message.content[0].type === "text" ? message.content[0].text : "";
        console.log(`[${TAG}] - Succeed to process MCP integration!`);
        return response;
    } catch (error) {
        console.error(`[${TAG}] - Error during MCP integration:`, error);
        throw new InternalServerError(`[${TAG}] - Failed to process MCP integration`);
    }
}
