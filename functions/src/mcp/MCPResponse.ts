/**
 * MCPサーバおよびクライアント間で用いるレスポンス(json rpc 2.0に準拠)
 */
export interface MCPResponse {
    /** プロトコル */
    jsonrpc: "2.0";
    /** レスポンス */
    result: any;
    /** id
     * 本来は複数リクエストに対する管理として使用する。
     * ただ、今回はクライアントが単一のため使わない可能性が非常に高い
     */
    id: string;
}
