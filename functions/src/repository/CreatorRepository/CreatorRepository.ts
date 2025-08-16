import {Creator, CreatorDocument} from "../../models/creator";
import {db} from "../../lib/firebase/firebase";
import {TagRepository} from "../TagRepository/TagRepository";
import {FieldValue, type Query, WriteBatch} from "firebase-admin/firestore";
import {FavoriteMode} from "../../util/enum/FavoriteMode";

/**
 * クリエイターデータの基本操作に関するクラス
 */
export class CreatorRepository {
    private collection = db.collection("creators");
    private tagRepository = new TagRepository();

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

    /**
     * Creatorにタグ名を付与
     *
     * @param {Creator} creator 変換対象のクリエイター（tagNamesは空でもよい）
     * @return {Creator} タグ名を含むクリエイター情報
     */
    private async enrichWithTagNames(creator: Omit<Creator, "tagNames">): Promise<Creator> {
        const tagNames = await this.tagRepository.getTagNamesByIds(creator.tags);
        return {
            ...creator,
            tagNames,
        };
    }

    /**
     * 複数のCreatorにタグ名を付与
     *
     * @param {Omit<Creator, "tagNames">[]} creators 変換対象のクリエイター配列
     * @return {Creator[]} タグ名を含むクリエイター配列
     */
    private async enrichMultipleWithTagNames(creators: Omit<Creator, "tagNames">[]): Promise<Creator[]> {
        return Promise.all(creators.map((creator) => this.enrichWithTagNames(creator)));
    }

    /**
     * 人気クリエイターを返却する
     *
     * @param {number} fetchCount データ読み込み件数
     * @return {Creator[]} 人気クリエイター（タグ名付き）
     */
    public async getPopularCreators(fetchCount: number): Promise<Creator[]> {
        const snapshot = await this.collection
            .orderBy("favoriteCount", "desc")
            .limit(fetchCount)
            .get();

        const creators = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Omit<Creator, "tagNames">));

        return this.enrichMultipleWithTagNames(creators);
    }

    /**
     * 最新のクリエイターを返却する
     * @param {number} fetchCount データ読み込み件数
     * @return {Creator[]} 最新クリエイター
     */
    public async getNewestCreators(fetchCount: number): Promise<Creator[]> {
        const snapshot = await this.collection
            .orderBy("createdAt", "desc")
            .limit(fetchCount)
            .get();

        const creators = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Omit<Creator, "tagNames">));

        return this.enrichMultipleWithTagNames(creators);
    }

    /**
     * クリエイターの存在確認
     *
     * @param {string} id 確認対象のクリエイターid
     * @return {boolean} クリエイターが存在するかどうか
     */
    public async creatorExists(id: string): Promise<boolean> {
        const doc = await this.collection.doc(id).get();
        return doc.exists;
    }

    /**
     * idを用いたクリエイター検索
     *
     * @param {string} id 検索対象のクリエイターid
     * @return {Creator | null} idに紐づいたクリエイター（タグ名付き）、見つからない場合はnull
     */
    public async getCreatorById(id: string): Promise<Creator | null> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const creator = {
            id: doc.id,
            ...doc.data(),
        } as Omit<Creator, "tagNames">;

        return this.enrichWithTagNames(creator);
    }

    /**
     * タグIDを用いたクリエイター検索（AND検索）
     *
     * @param {string[]} tagIds 検索対象のタグIDの配列
     * @param {number} fetchCount データ読み込み件数
     * @return {Creator[]} 全てのタグに一致するクリエイター（タグ名付き）
     */
    public async searchCreatorsByTags(
        tagIds: string[],
        fetchCount: number
    ): Promise<Creator[]> {
        // 最初のタグのみでFirestore検索
        const query: Query = this.collection.where("tags", "array-contains", tagIds[0]);

        const snapshot = await query
            .orderBy("favoriteCount", "desc")
            .limit(fetchCount * 3) // 多めに取得してクライアント側でフィルタ
            .get();

        const allResults = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Omit<Creator, "tagNames">));

        // 複数タグの場合はクライアント側でANDフィルタ
        const filteredCreators = tagIds.length === 1 ?
            allResults :
            allResults.filter((creator) =>
                tagIds.every((tagId) => creator.tags.includes(tagId))
            ).slice(0, fetchCount);

        return this.enrichMultipleWithTagNames(filteredCreators);
    }

    /**
     * お気に入り操作の切り替え
     *
     * @param {WriteBatch} batch Firestoreバッチ
     * @param {string} creatorId クリエイターId
     * @param {FavoriteMode} mode 切り替えモード
     */
    public toggleFavorite(
        batch: WriteBatch,
        creatorId: string,
        mode: FavoriteMode,
    ): void {
        const value = (mode == FavoriteMode.Add) ? 1 : -1;
        const doc = this.collection.doc(creatorId);
        batch.update(doc, {
            favoriteCount: FieldValue.increment(value),
            updatedAt: FieldValue.serverTimestamp(),
        });
    }
}
