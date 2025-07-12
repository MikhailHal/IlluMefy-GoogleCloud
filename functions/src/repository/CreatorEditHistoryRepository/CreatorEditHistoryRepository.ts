import {CreatorEditHistory, CreatorEditHistoryDocument} from "../../models/creatorEditHistory";
import {db} from "../../config/firebase/firebase";

/**
 * クリエイター編集履歴データの基本操作に関するクラス
 */
export class CreatorEditHistoryRepository {
    private collection = db.collection("creatorEditHistories");

    /**
     * 編集履歴の保存
     *
     * @param {CreatorEditHistoryDocument} editHistory 保存する編集履歴
     * @return {string} 保存した履歴のid
     */
    public async save(editHistory: CreatorEditHistoryDocument): Promise<string> {
        const docRef = await this.collection.add(editHistory);
        return docRef.id;
    }

    /**
     * クリエイター別の編集履歴取得
     *
     * @param {string} creatorId クリエイターID
     * @param {number} limit 取得件数（デフォルト: 50）
     * @param {string} cursor カーソル（ページネーション用）
     * @return {object} 編集履歴とnextCursor
     */
    public async getByCreatorId(
        creatorId: string,
        limit = 50,
        cursor?: string
    ): Promise<{
        histories: CreatorEditHistory[];
        nextCursor?: string;
    }> {
        let query = this.collection
            .where("creatorId", "==", creatorId)
            .orderBy("timestamp", "desc")
            .limit(limit);

        if (cursor) {
            const cursorDoc = await this.collection.doc(cursor).get();
            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc);
            }
        }

        const snapshot = await query.get();

        const histories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as CreatorEditHistory));

        const nextCursor = snapshot.docs.length === limit ?
            snapshot.docs[snapshot.docs.length - 1].id :
            undefined;

        return {
            histories,
            nextCursor,
        };
    }

    /**
     * ユーザー別の編集履歴取得
     *
     * @param {string} userId ユーザーID
     * @param {number} limit 取得件数（デフォルト: 50）
     * @param {string} cursor カーソル（ページネーション用）
     * @return {object} 編集履歴とnextCursor
     */
    public async getByUserId(
        userId: string,
        limit = 50,
        cursor?: string
    ): Promise<{
        histories: CreatorEditHistory[];
        nextCursor?: string;
    }> {
        let query = this.collection
            .where("userId", "==", userId)
            .orderBy("timestamp", "desc")
            .limit(limit);

        if (cursor) {
            const cursorDoc = await this.collection.doc(cursor).get();
            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc);
            }
        }

        const snapshot = await query.get();

        const histories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as CreatorEditHistory));

        const nextCursor = snapshot.docs.length === limit ?
            snapshot.docs[snapshot.docs.length - 1].id :
            undefined;

        return {
            histories,
            nextCursor,
        };
    }
}
