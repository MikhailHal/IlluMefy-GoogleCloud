import {TagDocument} from "../../../models/tag";
import {TagRepository} from "../../../repository/TagRepository/TagRepository";
import {ValidationError} from "../../../base/error/ValidationError";
import {Timestamp} from "../../../config/firebase/firebase";

/**
 * タグ作成ユースケース
 */
export class CreateTagUseCase {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository
    ) {}

    /**
     * タグ作成処理
     *
     * @param {string} name タグ名
     * @param {string} description タグ説明（オプション）
     * @return {string} 作成したタグのID
     * @throws {ValidationError} タグ名が重複している場合
     */
    public async execute(name: string, description?: string): Promise<string> {
        // タグ名の重複チェック
        const existingTag = await this.tagRepository.getTagByName(name);
        if (existingTag) {
            throw new ValidationError("Tag name already exists", {name});
        }

        const tagDocument: TagDocument = {
            name,
            description: description || "",
            viewCount: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        return await this.tagRepository.addTag(tagDocument);
    }
}
