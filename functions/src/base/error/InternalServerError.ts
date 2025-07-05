import {AppError, AppDetailCode} from "./AppError";

/**
 * 内部エラー
 */
export class InternalServerError extends AppError {
    /**
     * コンストラクタ
     */
    constructor() {
        super(
            "Missing required environment parameters.",
            501,
            AppDetailCode.InternalError
        );
    }
}
