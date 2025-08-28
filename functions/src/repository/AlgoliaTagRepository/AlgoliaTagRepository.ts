import {IAlgoliaTagRepository} from "./IAlgoliaTagRepository";
import {Tag} from "../../models/tag";
import {write, deleteIndex} from "../../lib/alogolia/algolia";

/**
 * Algoliaタグリポジトリ
 */
export class AlgoliaTagRepository implements IAlgoliaTagRepository {
    // インデックス名
    private readonly INDEX_NAME = "tags";
    /**
     * Algoliaへの書き込み
     * @param {Tag[]} tagList 書き込みするタグ一覧
     */
    async syncTags(tagList: Tag[]): Promise<void> {
        await deleteIndex(this.INDEX_NAME);

        const tags = tagList.map((tag) => ({
            id: tag.id,
            name: tag.name,
            viewCount: tag.viewCount,
        }));

        await Promise.all(
            tags.map((tag) => write(this.INDEX_NAME, tag.id, tag))
        );
    }

    /**
     * クエリにヒットするタグを検索
     * @param {string} _query クエリ
     * @return {Tag[] | null} ヒット結果
     */
    async tagIncrementalSearch(_query: string): Promise<Tag[] | null> {
        // TODO: インクリメンタルサーチ実装
        return null;
    }
}
