import type {Timestamp} from "firebase-admin/firestore";
import type {FieldValue} from "@google-cloud/firestore";

/**
 * タグ情報のモデル定義
 */
export interface Tag {
    /** Firestore ドキュメントID */
    id: string;
    /** タグ名 */
    name: string;
    /** タグ説明 */
    description: string;
    /** 閲覧回数 */
    viewCount: number;
    /** 作成日時 */
    createdAt: Timestamp;
    /** 更新日時 */
    updatedAt: Timestamp;
    /** ベクトル */
    vector: ReturnType<typeof FieldValue.vector>;
}

/** Firestoreに保存する際の型（idを除外） */
export type TagDocument = Omit<Tag, "id">
