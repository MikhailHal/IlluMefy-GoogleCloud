import {AppError, AppDetailCode} from "./AppError";

/**
 * Firebase設定エラー
 */
export class FirebaseConfigError extends AppError {
    /**
     * コンストラクタ
     * @param {string} message エラーメッセージ
     */
    constructor(message = "Firebase configuration error") {
        super(
            message,
            500,
            AppDetailCode.FirebaseConfigError,
        );
    }
}