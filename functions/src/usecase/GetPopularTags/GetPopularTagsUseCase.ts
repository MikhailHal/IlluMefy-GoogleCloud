import { Tag } from "../../models/tag";
import { TagRepository } from "../../repository/TagRepository/TagRepository";

/**
 * 人気タグ取得ユースケース
 */
export class GetPopularTagsUseCase {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository
    ) {}

    /**
     * 人気タグ取得処理
     *
     * @param {number} fetchCount 取得件数
     * @return {Tag[]} 人気タグ一覧
     */
    public async execute(fetchCount: number): Promise<Tag[]> {
        return await this.tagRepository.getPopularTags(fetchCount);
    }
}