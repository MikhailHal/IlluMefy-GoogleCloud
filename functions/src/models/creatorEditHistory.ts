import type {Timestamp} from "firebase-admin/firestore";

/**
 * クリエイター編集履歴のモデル定義
 */
export interface CreatorEditHistory {
    /** Firestore ドキュメントID */
    id: string;
    /** 編集対象のクリエイターID */
    creatorId: string;
    /** 編集対象のクリエイター名（表示用、削除されても履歴で見える） */
    creatorName: string;

    /** 基本情報の変更 */
    basicInfoChanges?: {
        name?: { before: string; after: string };
        description?: { before: string; after: string };
        profileImageUrl?: { before: string; after: string };
    };

    /** SNSリンクの変更 */
    socialLinksChanges?: {
        youtubeUrl?: { before: string; after: string };
        twitchUrl?: { before: string; after: string };
        tiktokUrl?: { before: string; after: string };
        instagramUrl?: { before: string; after: string };
        xUrl?: { before: string; after: string };
        discordUrl?: { before: string; after: string };
        niconicoUrl?: { before: string; after: string };
    };

    /** タグの変更 */
    tagsChanges?: {
        added: string[]; // 追加されたタグ名
        removed: string[]; // 削除されたタグ名
    };

    /** 編集者情報 */
    userId: string;
    userPhoneNumber: string; // BAN用

    /** メタデータ */
    timestamp: Timestamp;
    editReason?: "user_edit" | "moderation" | "correction_request" | "bulk_update";
    moderatorNote?: string; // モデレーターが編集した場合のメモ
}

/** Firestoreに保存する際の型（idを除外） */
export type CreatorEditHistoryDocument = Omit<CreatorEditHistory, "id">;
