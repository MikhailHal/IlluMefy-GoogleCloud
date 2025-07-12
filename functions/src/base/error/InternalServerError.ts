import {AppError, AppDetailCode} from "./AppError";

/**
 * 内部エラー
 */
export class InternalServerError extends AppError {
    /**
     * コンストラクタ
     *
     * @param {string} message エラーメッセージ
     */
    constructor(message="Missing required environment parameters.") {
        super(
            message,
            501,
            AppDetailCode.InternalError
        );
    }
}
