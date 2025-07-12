import {TagDocument} from "../../../models/tag";
import {TagRepository} from "../../../repository/TagRepository/TagRepository";
import {ValidationError} from "../../../base/error/ValidationError";
import {NotFoundError} from "../../../base/error/NotFoundError";
import {Timestamp} from "../../../lib/firebase/firebase";

/**
 * タグ更新ユースケース
 */
export class UpdateTagUseCase {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository
    ) {}

    /**
     * タグ更新処理
     *
     * @param {string} tagId タグID
     * @param {Partial<TagDocument>} updates 更新内容
     * @return {void}
     * @throws {NotFoundError} タグが見つからない場合
     * @throws {ValidationError} 新しいタグ名が重複している場合
     */
    public async execute(tagId: string, updates: Partial<TagDocument>): Promise<void> {
        // 現在のタグを取得
        const currentTag = await this.tagRepository.getTagById(tagId);
        if (!currentTag) {
            throw new NotFoundError("Tag not found");
        }

        // タグ名を変更する場合は重複チェック
        if (updates.name && updates.name !== currentTag.name) {
            const existingTag = await this.tagRepository.getTagByName(updates.name);
            if (existingTag) {
                throw new ValidationError("Tag name already exists", {name: updates.name});
            }
        }

        const updatesWithTimestamp = {
            ...updates,
            updatedAt: Timestamp.now(),
        };

        return await this.tagRepository.updateTag(tagId, updatesWithTimestamp);
    }
}
