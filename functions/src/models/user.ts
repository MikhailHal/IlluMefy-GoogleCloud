import type {Timestamp} from "firebase-admin/firestore";

/**
 * ユーザー情報のモデル定義
 */
export interface User {
    /** Firebase Auth UID */
    id: string;
    /** 表示名 */
    displayName?: string;
    /** メールアドレス */
    email?: string;
    /** 電話番号 */
    phoneNumber?: string;
    /** お気に入りクリエイターIDの配列 */
    favoriteCreators: string[];
    /** タグ検索履歴 */
    searchTagHistories: Array<{
        /** 検索時に使用したタグIDの組み合わせ */
        tagIds: string[];
        /** 検索実行日時 */
        timestamp: Timestamp;
    }>;
    /** クリエイター閲覧履歴 */
    viewCreatorHistories: Array<{
        /** 閲覧したクリエイターのID */
        creatorId: string;
        /** 閲覧日時 */
        timestamp: Timestamp;
    }>;
    /** アカウント作成日時 */
    createdAt: Timestamp;
    /** 最終更新日時 */
    updatedAt: Timestamp;
}

/** Firestoreに保存する際の型（idを除外） */
export type UserDocument = Omit<User, "id">;
