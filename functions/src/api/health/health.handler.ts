import {Request, Response} from "express";

/**
 * 死活監視(ヘルスチェック)
 *
 * サーバの死活監視用API
 *
 * 各種サービスから定期的に呼び出され稼働状況を確認する。
 *
 * @param {object} _
 * @param {object} res レスポンス情報
 *
 * @return {string} status サービス稼働状態
 * @return {string} timestamp レスポンス時刻(ISO 8601)
 */
export const healthHandler = async (_: Request, res: Response) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
};
