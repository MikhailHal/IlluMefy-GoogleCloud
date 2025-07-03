import {Creator} from "../../models/creator";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

/**
 * ID指定でクリエイター取得ユースケース
 */
export class GetCreatorByIdUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository
    ) {}

    /**
     * クリエイター取得処理
     *
     * @param {string} id クリエイターID
     * @return {Creator} クリエイター情報
     * @throws {Error} クリエイターが見つからない場合
     */
    public async execute(id: string): Promise<Creator> {
        return await this.creatorRepository.getCreatorById(id);
    }
}
