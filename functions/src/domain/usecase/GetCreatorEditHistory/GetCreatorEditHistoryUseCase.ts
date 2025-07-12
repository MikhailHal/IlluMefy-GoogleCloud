import {CreatorEditHistory} from "../../../models/creatorEditHistory";
import {CreatorEditHistoryRepository} from "../../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";

/**
 * クリエイター別編集履歴取得ユースケース
 */
export class GetCreatorEditHistoryUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorEditHistoryRepository} editHistoryRepository 編集履歴リポジトリ
     */
    constructor(
        private editHistoryRepository: CreatorEditHistoryRepository
    ) {}

    /**
     * クリエイター別編集履歴取得処理
     *
     * @param {string} creatorId クリエイターID
     * @param {number} limit 取得件数
     * @param {string} cursor カーソル（ページネーション用）
     * @return {object} 編集履歴とnextCursor
     */
    public async execute(
        creatorId: string,
        limit: number,
        cursor?: string
    ): Promise<{
        histories: CreatorEditHistory[];
        nextCursor?: string;
    }> {
        return this.editHistoryRepository.getByCreatorId(creatorId, limit, cursor);
    }
}
