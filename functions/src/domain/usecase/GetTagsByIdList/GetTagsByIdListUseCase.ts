import {Tag} from "../../../models/tag";
import {TagRepository} from "../../../repository/TagRepository/TagRepository";
import {GetTagsByIdListUseCaseProtocol} from "./GetTagsByIdListUseCaseProtocol";

/**
 * タグID一覧からタグ情報取得
 */
export class GetTagsByIdListUseCase implements GetTagsByIdListUseCaseProtocol {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository
    ) {}

    /**
     * タグID一覧からタグ情報取得処理
     *
     * @param {string[]} tagIds 取得対象のタグID一覧
     * @return {Tag[]} タグ情報一覧（存在しないIDは除外）
     */
    public async execute(tagIds: string[]): Promise<Tag[]> {
        return await this.tagRepository.getTagByIdList(tagIds);
    }
}
