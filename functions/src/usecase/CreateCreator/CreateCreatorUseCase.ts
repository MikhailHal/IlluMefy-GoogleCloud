import {CreatorDocument} from "../../models/creator";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

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
     */
    public async execute(creatorDocument: CreatorDocument): Promise<string> {
        return await this.creatorRepository.addCreator(creatorDocument);
    }
}
