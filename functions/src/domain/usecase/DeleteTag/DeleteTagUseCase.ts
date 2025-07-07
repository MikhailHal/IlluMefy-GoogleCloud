import {TagRepository} from "../../../repository/TagRepository/TagRepository";
import {NotFoundError} from "../../../base/error/NotFoundError";

/**
 * タグ削除ユースケース
 */
export class DeleteTagUseCase {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository
    ) {}

    /**
     * タグ削除処理
     *
     * @param {string} tagId タグID
     * @return {void}
     * @throws {NotFoundError} タグが見つからない場合
     */
    public async execute(tagId: string): Promise<void> {
        // タグの存在確認
        const tag = await this.tagRepository.getTagById(tagId);
        if (!tag) {
            throw new NotFoundError("Tag not found");
        }

        await this.tagRepository.deleteTag(tagId);
    }
}
