import {Creator} from "../../../models/creator";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {ValidationError} from "../../../base/error/ValidationError";

/**
 * 人気クリエイター取得ユースケース
 */
export class GetPopularCreatorsUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository,
    ) {}

    /**
     * 人気クリエイター取得処理
     *
     * @param {number} fetchCount 取得件数
     * @return {Creator[]} 人気クリエイター
     * @throws {ValidationError} パラメータが不正な場合
     */
    public async execute(fetchCount: number): Promise<Creator[]> {
        // パラメータバリデーション
        if (!Number.isInteger(fetchCount)) {
            throw new ValidationError("Fetch count must be an integer");
        }
        if (fetchCount <= 0) {
            throw new ValidationError("Fetch count must be greater than 0");
        }
        if (fetchCount > 100) {
            throw new ValidationError("Fetch count cannot exceed 100");
        }

        const creators = await this.creatorRepository.getPopularCreators(fetchCount);
        return creators;
    }
}
