import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {JSONRPCRequest, ListToolsRequestSchema, CallToolRequestSchema} from "@modelcontextprotocol/sdk/types.js";
import {executeWebSearch} from "./tools/webSearch.js";

/**
 * MCP Server
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
        }, {
            capabilities: {
                tools: {},
            },
        });
    }

    /**
     * MCPサーバの初期化
     */
    async initialize() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "web_search",
                    description: "Search the web for information",
                    inputSchema: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "Search query",
                            },
                        },
                        required: ["query"],
                    },
                },
            ],
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const {name, arguments: args} = request.params;

            if (name === "web_search") {
                return await executeWebSearch(args);
            }

            throw new Error(`Unknown tool: ${name}`);
        });

        console.log("MCP Server initialized");
    }

    /**
     * JSON-RPCリクエストの処理
     *
     * @param {JSONRPCRequest} request リクエスト
     * @return {any} 処理結果
     */
    async handleRequest(request: JSONRPCRequest): Promise<any> {
        try {
            if (request.method === "tools/list") {
                return {
                    jsonrpc: "2.0",
                    id: request.id,
                    result: {
                        tools: [
                            {
                                name: "web_search",
                                description: "Search the web for information",
                                inputSchema: {
                                    type: "object",
                                    properties: {
                                        query: {
                                            type: "string",
                                            description: "Search query",
                                        },
                                    },
                                    required: ["query"],
                                },
                            },
                        ],
                    },
                };
            }

            if (request.method === "tools/call") {
                const params = request.params as { name: string; arguments: any };
                const {name, arguments: args} = params;
                if (name === "web_search") {
                    const result = await executeWebSearch(args);
                    return {
                        jsonrpc: "2.0",
                        id: request.id,
                        result: result,
                    };
                }
            }

            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: -32601,
                    message: "Method not found",
                },
            };
        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: request.id,
                error: {
                    code: -32603,
                    message: "Internal error",
                },
            };
        }
    }

    /**
     * MCPサーバ開始
     */
    async start() {
        await this.initialize();
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
    }
}
