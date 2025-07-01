import type {Timestamp} from "firebase-admin/firestore";

/**
 * タグ情報のモデル定義
 * 階層構造を持つタグシステムで、動的計画法による最適化を実装
 */
export interface Tag {
    /** Firestore ドキュメントID */
    id: string;
    /** タグ名 */
    name: string;
    /** 作成日時 */
    createdAt: Timestamp;
    /** 更新日時 */
    updatedAt: Timestamp;
    /** 親タグのID（ルートタグの場合はundefined） */
    parentTagId?: string;
    /**
     * このタグの全子孫タグID（DP最適化用キャッシュ）
     * 階層クエリをO(N)からO(1)に最適化
     */
    descendantTagIds: string[];
}

/** Firestoreに保存する際の型（idを除外） */
export type TagDocument = Omit<Tag, "id">
