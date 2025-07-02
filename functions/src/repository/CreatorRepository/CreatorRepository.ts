import {Creator, CreatorDocument} from "../../models/creator";
import {db} from "../../config/firebase";
import type {Query} from "firebase-admin/firestore";

/**
 * クリエイターデータの基本操作に関するクラス
 */
export class CreatorRepository {
    private collection = db.collection("creators");

    /**
     * 人気クリエイターを返却する
     *
     * @param {number} fetchCount データ読み込み件数
     * @return {Creator[]} 人気クリエイター
     */
    public async getPopularCreators(fetchCount: number): Promise<Creator[]> {
        const snapshot = await this.collection
            .orderBy("favoriteCount", "desc")
            .limit(fetchCount)
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Creator));
    }

    /**
     * idを用いたクリエイター検索
     *
     * @param {string} id 検索対象のクリエイターid
     * @return {Creator} idに紐づいたクリエイター
     * @throws {Error} クリエイターが見つからない場合
     */
    public async getCreatorById(id: string): Promise<Creator> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            throw new Error(`Creator with id ${id} not found`);
        }

        return {
            id: doc.id,
            ...doc.data(),
        } as Creator;
    }

    /**
     * タグIDを用いたクリエイター検索（AND検索）
     *
     * @param {string[]} tagIds 検索対象のタグIDの配列
     * @param {number} fetchCount データ読み込み件数
     * @return {Creator[]} 全てのタグに一致するクリエイター
     */
    public async searchCreatorsByTags(
        tagIds: string[],
        fetchCount: number
    ): Promise<Creator[]> {
        let query: Query = this.collection;
        // 各タグに対してarray-containsを追加（AND条件）
        tagIds.forEach((tagId) => {
            query = query.where("tags", "array-contains", tagId);
        });

        const snapshot = await query
            .orderBy("favoriteCount", "desc")
            .limit(fetchCount)
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Creator));
    }

    /**
     * クリエイターの登録
     *
     * @param {CreatorDocument} creatorDocument 登録するクリエイター
     * @return {string} 登録したクリエイターのid
     */
    public async addCreator(creatorDocument: CreatorDocument): Promise<string> {
        const docRef = await this.collection.add(creatorDocument);
        return docRef.id;
    }

    /**
     * クリエイター情報の更新
     *
     * @param {string} id 更新対象のクリエイターid
     * @param {Partial<CreatorDocument>} updates 更新するフィールド
     * @return {void}
     */
    public async updateCreator(
        id: string,
        updates: Partial<CreatorDocument>
    ): Promise<void> {
        await this.collection.doc(id).update(updates);
    }

    /**
     * クリエイターの削除
     *
     * @param {string} id 削除対象のクリエイターid
     * @return {void}
     */
    public async deleteCreator(id: string): Promise<void> {
        await this.collection.doc(id).delete();
    }
}
