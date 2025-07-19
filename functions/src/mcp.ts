import {onRequest} from "firebase-functions/v2/https";
import {MCPServer} from "./mcp/server";
import {getSecret} from "./lib/secretManager/secretManager";
import {initializeBraveSearch} from "./lib/search/braveSearch";

/**
 * MCPサーバーの入り口
 */
export const mcp = onRequest({
    region: "asia-northeast1",
    cors: true,
    timeoutSeconds: 300,
}, async (req, res) => {
    try {
        // Brave Search APIを初期化
        try {
            const braveSearchApiKey = await getSecret("brave-search-api-key");
            initializeBraveSearch(braveSearchApiKey);
        } catch (error) {
            console.error("Failed to initialize Brave Search API:", error);
        }

        const server = new MCPServer();
        await server.initialize();

        if (req.method === "POST" && req.body) {
            const response = await server.handleRequest(req.body);
            res.json(response);
        } else {
            res.json({
                status: "MCP Server initialized",
                name: "illumefy-mcp",
                version: "1.0.0",
            });
        }
    } catch (error) {
        console.error("MCP Server error:", error);
        res.status(500).json({error: "Internal server error"});
    }
});
