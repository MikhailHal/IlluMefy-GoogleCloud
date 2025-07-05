import {CreatorDocument} from "../../models/creator";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {ValidationError} from "../../base/error/ValidationError";

/**
 * クリエイター作成ユースケース
 */
export class CreateCreatorUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository
    ) {}

    /**
     * クリエイター作成処理
     *
     * @param {CreatorDocument} creatorDocument クリエイター情報
     * @return {string} 作成したクリエイターのID
     * @throws {ValidationError} 入力データが不正な場合
     */
    public async execute(creatorDocument: CreatorDocument): Promise<string> {
        // 必須フィールドのバリデーション
        if (!creatorDocument.name || creatorDocument.name.trim() === "") {
            throw new ValidationError("Creator name is required");
        }

        if (!creatorDocument.iconImageUrl || creatorDocument.iconImageUrl.trim() === "") {
            throw new ValidationError("Icon image URL is required");
        }

        if (!creatorDocument.platforms || creatorDocument.platforms.length === 0) {
            throw new ValidationError("At least one platform is required");
        }

        // URLフォーマットの簡易チェック
        try {
            new URL(creatorDocument.iconImageUrl);
        } catch {
            throw new ValidationError("Invalid icon image URL format");
        }

        // タグの重複削除
        if (creatorDocument.tags && creatorDocument.tags.length > 0) {
            creatorDocument.tags = [...new Set(creatorDocument.tags)];
        }

        return await this.creatorRepository.addCreator(creatorDocument);
    }
}
