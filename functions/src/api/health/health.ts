import {onRequest} from "firebase-functions/v2/https";

/**
 * 死活監視(ヘルスチェック)
 *
 * サーバの死活監視用API
 *
 * 各種サービスから定期的に呼び出され稼働状況を確認する。
 *
 * @param 不要
 *
 * @returns {string} status サービス稼働状態
 * @returns {string} timestamp レスポンス時刻(ISO 8601)
 * @returns {string} version バージョン情報
 */
export const health = onRequest((_, response) => {
    response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
