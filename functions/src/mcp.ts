import {onRequest} from "firebase-functions/v2/https";
import {MCPServer} from "./mcp/server";
import {MCPRequest} from "./mcp/MCPRequest";

/**
 * MCPサーバーの入り口
 */
export const mcp = onRequest({
    region: "asia-northeast1",
    cors: true,
    timeoutSeconds: 300,
}, async (req, res) => {
    const server = new MCPServer();
    const data = await server.processRequest(req.body as MCPRequest);
    res.json(data);
});
