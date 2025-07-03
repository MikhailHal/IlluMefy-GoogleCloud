import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

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
     */
    public async execute(id: string): Promise<void> {
        return await this.creatorRepository.deleteCreator(id);
    }
}
