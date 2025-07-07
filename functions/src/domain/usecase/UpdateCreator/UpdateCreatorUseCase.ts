import {CreatorDocument} from "../../../models/creator";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {ValidationError} from "../../../base/error/ValidationError";
import {NotFoundCreatorError} from "../../../base/error/NotFoundCreatorError";

/**
 * クリエイター更新ユースケース
 */
export class UpdateCreatorUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository
    ) {}

    /**
     * クリエイター更新処理
     *
     * @param {string} id クリエイターID
     * @param {Partial<CreatorDocument>} updates 更新するフィールド
     * @return {void}
     * @throws {ValidationError} 入力データが不正な場合
     * @throws {NotFoundCreatorError} クリエイターが見つからない場合
     */
    public async execute(id: string, updates: Partial<CreatorDocument>): Promise<void> {
        // IDバリデーション
        if (!id || id.trim() === "") {
            throw new ValidationError("Creator ID is required");
        }

        // 更新データのバリデーション
        if (!updates || Object.keys(updates).length === 0) {
            throw new ValidationError("No update fields provided");
        }

        // クリエイターの存在確認
        const creator = await this.creatorRepository.getCreatorById(id);
        if (!creator) {
            throw new NotFoundCreatorError();
        }

        // 特定フィールドのバリデーション
        if (updates.name !== undefined && updates.name.trim() === "") {
            throw new ValidationError("Creator name cannot be empty");
        }

        if (updates.profileImageUrl !== undefined) {
            if (updates.profileImageUrl.trim() === "") {
                throw new ValidationError("Profile image URL cannot be empty");
            }
            try {
                new URL(updates.profileImageUrl);
            } catch {
                throw new ValidationError("Invalid profile image URL format");
            }
        }

        if (updates.platforms !== undefined && Object.keys(updates.platforms).length === 0) {
            throw new ValidationError("At least one platform is required");
        }

        // タグの重複削除
        if (updates.tags && updates.tags.length > 0) {
            updates.tags = [...new Set(updates.tags)];
        }

        return await this.creatorRepository.updateCreator(id, updates);
    }
}
