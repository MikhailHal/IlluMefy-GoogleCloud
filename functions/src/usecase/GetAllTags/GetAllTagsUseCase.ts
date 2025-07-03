import { Tag } from "../../models/tag";
import { TagRepository } from "../../repository/TagRepository/TagRepository";

/**
 * 全タグ取得ユースケース
 */
export class GetAllTagsUseCase {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository
    ) {}

    /**
     * 全タグ取得処理
     *
     * @return {Tag[]} 全てのタグ
     */
    public async execute(): Promise<Tag[]> {
        return await this.tagRepository.getAllTags();
    }
}