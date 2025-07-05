import {AppError, AppDetailCode} from "./AppError";

/**
 * ユーザー発見なしエラー
 */
export class NotFoundUserError extends AppError {
    /**
     * コンストラクタ
     */
    constructor() {
        super(
            "The user you searched isn't found.",
            404,
            AppDetailCode.NotFound,
        );
    }
}
