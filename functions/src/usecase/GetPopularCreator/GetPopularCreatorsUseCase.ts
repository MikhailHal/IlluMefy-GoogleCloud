import {Creator} from "../../models/creator";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

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
     */
    public async execute(fetchCount: number): Promise<Creator[]> {
        let creators = await this.creatorRepository.getPopularCreators(fetchCount);
        return creators
    }
}