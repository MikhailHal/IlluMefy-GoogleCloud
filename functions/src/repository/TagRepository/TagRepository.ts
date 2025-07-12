import {db} from "../../lib/firebase/firebase";
import {Tag, TagDocument} from "../../models/tag";
import {FieldValue} from "@google-cloud/firestore";

/**
 * タグデータの基本操作に関するクラス
 */
export class TagRepository {
    private collection = db.collection("tags");

    /**
     * idを用いたタグ検索
     *
     * @param {string} id 検索対象のタグid
     * @return {Tag | null} タグ情報（存在しない場合はnull）
     */
    public async getTagById(id: string): Promise<Tag | null> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            return null;
        }

        return {
            id: doc.id,
            ...doc.data(),
        } as Tag;
    }

    /**
     * 人気タグ取得
     *
     * @param {number} fetchCount 取得件数
     * @return {Tag[]} 人気タグ一覧
     */
    public async getPopularTags(fetchCount: number): Promise<Tag[]> {
        const snapshot = await this.collection
            .orderBy("viewCount", "desc")
            .limit(fetchCount)
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }) as Tag);
    }

    /**
     * タグの追加
     *
     * @param {TagDocument} tagDocument 登録するタグ
     * @return {string} 追加したタグのid
     */
    public async addTag(tagDocument: TagDocument): Promise<string> {
        const docRef = this.collection.add(tagDocument);
        return (await docRef).id;
    }

    /**
     * 全タグの取得
     *
     * @return {Tag[]} 全てのタグ
     */
    public async getAllTags(): Promise<Tag[]> {
        const snapshot = await this.collection.get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Tag));
    }

    /**
     * タグ情報の更新
     *
     * @param {string} id 更新対象のタグid
     * @param {Partial<TagDocument>} updates 更新するフィールド
     * @return {void}
     */
    public async updateTag(
        id: string,
        updates: Partial<TagDocument>
    ): Promise<void> {
        await this.collection.doc(id).update(updates);
    }

    /**
     * タグの削除
     *
     * @param {string} id 削除対象のタグid
     * @return {void}
     */
    public async deleteTag(id: string): Promise<void> {
        await this.collection.doc(id).delete();
    }

    /**
     * 複数のタグIDからタグ名を取得
     *
     * @param {string[]} tagIds 取得対象のタグIDの配列
     * @return {string[]} タグ名の配列（存在しないIDは除外）
     */
    public async getTagNamesByIds(tagIds: string[]): Promise<string[]> {
        if (tagIds.length === 0) {
            return [];
        }

        // Firestoreの制限により最大10件ずつ処理
        const chunkSize = 10;
        const tagNames: string[] = [];

        for (let i = 0; i < tagIds.length; i += chunkSize) {
            const chunk = tagIds.slice(i, i + chunkSize);
            const snapshot = await this.collection
                .where("__name__", "in", chunk.map((id) => this.collection.doc(id)))
                .get();

            snapshot.docs.forEach((doc) => {
                const tagData = doc.data() as TagDocument;
                tagNames.push(tagData.name);
            });
        }

        return tagNames;
    }

    /**
     * タグ名での検索
     *
     * @param {string} name 検索対象のタグ名
     * @return {Tag | null} タグ情報（存在しない場合はnull）
     */
    public async getTagByName(name: string): Promise<Tag | null> {
        const snapshot = await this.collection
            .where("name", "==", name)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        } as Tag;
    }

    /**
     * 類似タグを取得する
     *
     * @param {number[]} queryVector クエリベクター
     * @return {Tag} 類似タグ
     */
    public async getNearestTagByVector(queryVector: number[]): Promise<[Tag, number] | null> {
        const snapshot = await this.collection
            .findNearest({
                vectorField: "vector",
                queryVector: FieldValue.vector(queryVector),
                limit: 1,
                distanceMeasure: "COSINE",
                distanceResultField: "vector_distance",
            }).get();

        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        const tagInfo = {
            id: doc.id,
            ...doc.data(),
        } as Tag;
        const distance = doc.get("vector_distance");

        return [tagInfo, distance];
    }
}
