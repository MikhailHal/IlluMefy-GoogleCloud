import {AppError, AppDetailCode} from "./AppError";

/**
 * クリエイター発見なしエラー
 */
export class NotFoundCreatorError extends AppError {
    /**
     * コンストラクタ
     */
    constructor() {
        super(
            "The creator you searched isn't found.",
            404,
            AppDetailCode.NotFound
        );
    }
}
