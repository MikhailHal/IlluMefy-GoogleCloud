import {Creator} from "../../../models/creator";
import {GetNewestCreatorsUseCaseProtocol} from "./GetNewestCreatorsUseCaseProtocol";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {ValidationError} from "../../../base/error/ValidationError";

/**
 * 最新クリエイター取得
 */
export class GetNewestCreatorsUseCase implements GetNewestCreatorsUseCaseProtocol {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} repository クリエイターリポジトリ
     */
    constructor(
        private repository: CreatorRepository
    ) {}

    /**
     * 実行
     *
     * @param {number} fetchCount 取得件数
     * @return {Promise<Creator[]>} 最新クリエイター
     */
    public async execute(fetchCount: number): Promise<Creator[]> {
        if (!Number.isInteger(fetchCount)) {
            throw new ValidationError("Fetch count must be an integer");
        }
        if (fetchCount <= 0) {
            throw new ValidationError("Fetch count must be greater than 0");
        }
        if (fetchCount > 100) {
            throw new ValidationError("Fetch count cannot exceed 100");
        }
        return this.repository.getNewestCreators(fetchCount);
    }
}
