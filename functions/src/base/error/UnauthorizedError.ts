import {AppError, AppDetailCode} from "./AppError";

/**
 * 認証エラー
 */
export class UnauthorizedError extends AppError {
    /**
     * コンストラクタ
     * @param {string} message エラーメッセージ
     */
    constructor(message = "Authentication required") {
        super(
            message,
            401,
            AppDetailCode.Unauthorized,
        );
    }
}