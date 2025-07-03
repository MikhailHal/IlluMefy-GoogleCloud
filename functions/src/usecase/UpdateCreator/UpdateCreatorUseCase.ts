import { CreatorDocument } from "../../models/creator";
import { CreatorRepository } from "../../repository/CreatorRepository/CreatorRepository";

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
     */
    public async execute(id: string, updates: Partial<CreatorDocument>): Promise<void> {
        return await this.creatorRepository.updateCreator(id, updates);
    }
}