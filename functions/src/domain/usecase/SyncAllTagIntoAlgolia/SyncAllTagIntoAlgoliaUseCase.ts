import {ISyncAllTagIntoAlgoliaUseCase} from "./ISyncAllTagIntoAlgoliaUseCase";
import {TagRepository} from "../../../repository/TagRepository/TagRepository";
import {IAlgoliaTagRepository} from "../../../repository/AlgoliaTagRepository/IAlgoliaTagRepository";

/**
 * 全タグをAlgoliaに同期するユースケース
 */
export class SyncAllTagIntoAlgoliaUseCase implements ISyncAllTagIntoAlgoliaUseCase {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     * @param {IAlgoliaTagRepository} algoliaTagRepository Algoliaタグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository,
        private algoliaTagRepository: IAlgoliaTagRepository
    ) {}

    /**
     * 全タグ同期処理
     *
     * @return {Promise<void>}
     */
    public async execute(): Promise<void> {
        const allTags = await this.tagRepository.getAllTags();
        await this.algoliaTagRepository.syncTags(allTags);
    }
}
