import {AppError, AppDetailCode} from "./AppError";

/**
 * バリデーションエラー
 */
export class ValidationError extends AppError {
    /**
     * コンストラクタ
     * @param {string} message エラーメッセージ
     * @param {Record<string, unknown>} details 詳細情報（フィールド名、期待値など）
     */
    constructor(message: string, public details?: Record<string, unknown>) {
        super(
            message,
            400,
            AppDetailCode.ValidationError,
        );
    }
}
