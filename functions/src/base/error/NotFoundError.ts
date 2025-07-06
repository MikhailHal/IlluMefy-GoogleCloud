import {AppError, AppDetailCode} from "./AppError";

/**
 * リソースが見つからない場合のエラー
 */
export class NotFoundError extends AppError {
    /**
     * コンストラクタ
     * @param {string} message エラーメッセージ
     */
    constructor(message = "Resource not found") {
        super(message, 404, AppDetailCode.NotFound);
    }
}
