import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {MCPRequest} from "./MCPRequest";
import { MCPResponse } from "./MCPResponse";

/**
 * MCP Server for IlluMefy
 */
export class MCPServer {
    private server: Server;

    /**
     * コンストラクタ
     */
    constructor() {
        this.server = new Server({
            name: "illumefy-mcp",
            version: "1.0.0",
        });
    }

    /**
     * MCPサーバの初期化
     */
    async initialize() {
        // TODO: ツール実装
        console.log("MCP Server initialized");
    }

    /**
     * MCPサーバ開始
     */
    async start() {
        await this.initialize();
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
    }

    /**
     * リクエストの処理
     *
     * @param {MCPRequest} request リクエスト
     * @return {MCPResponse} 処理結果
     */
    async processRequest(request: MCPRequest): Promise<MCPResponse> {
        const response: MCPResponse = {
            jsonrpc: "2.0",
            result: `Processed method: ${request.method}`,
            id: request.id,
        };
        return response;
    }
}
