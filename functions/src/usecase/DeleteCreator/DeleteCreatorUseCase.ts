import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {ValidationError} from "../../base/error/ValidationError";
import {NotFoundCreatorError} from "../../base/error/NotFoundCreatorError";

/**
 * クリエイター削除ユースケース
 */
export class DeleteCreatorUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository
    ) {}

    /**
     * クリエイター削除処理
     *
     * @param {string} id クリエイターID
     * @return {void}
     * @throws {ValidationError} IDが不正な場合
     * @throws {NotFoundCreatorError} クリエイターが見つからない場合
     */
    public async execute(id: string): Promise<void> {
        // IDバリデーション
        if (!id || id.trim() === "") {
            throw new ValidationError("Creator ID is required");
        }

        // クリエイターの存在確認
        const creator = await this.creatorRepository.getCreatorById(id);
        if (!creator) {
            throw new NotFoundCreatorError();
        }

        return await this.creatorRepository.deleteCreator(id);
    }
}
