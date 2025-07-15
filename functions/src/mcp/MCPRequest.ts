/**
 * MCPサーバおよびクライアント間で用いるリクエスト(json rpc 2.0に準拠)
 */
export interface MCPRequest {
    /** プロトコル */
    jsonrpc: "2.0";
    /** 処理の種類 */
    method: string;
    /** パラメータ */
    params?: any;
    /** id
     * 本来は複数リクエストに対する管理として使用する。
     * ただ、今回はクライアントが単一のため使わない可能性が非常に高い
     */
    id: string;
}
