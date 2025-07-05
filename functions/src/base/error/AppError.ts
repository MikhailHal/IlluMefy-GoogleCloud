/**
 * アプリケーション全体のエラーベースクラス
 */
export class AppError extends Error {
    /**
     * コンストラクタ
     *
     * @param {string} message エラーメッセージ
     * @param {number} statusCode ステータスコード(200番など)
     * @param {string} detailCode 詳細コード(アプリ特有のエラーコード。フロント側ではこれを用いて内容を判別)
     */
    constructor(
        public message: string,
        public statusCode: number,
        public detailCode: string,
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * アプリケーション全体で使うエラーコード
 */
export enum AppDetailCode {
    InternalError = "INTERNAL_ERROR",
    NotFound = "NOT_FOUND",
    ValidationError = "VALIDATION_ERROR",
    Unauthorized = "UNAUTHORIZED",
    Forbidden = "FORBIDDEN",
    Conflict = "CONFLICT",
    FirebaseConfigError = "FIREBASE_CONFIG_ERROR",
}
