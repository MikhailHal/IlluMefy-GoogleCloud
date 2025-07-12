import {CreatorEditHistory} from "../../../models/creatorEditHistory";
import {CreatorEditHistoryRepository} from "../../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";

/**
 * ユーザー別編集履歴取得ユースケース
 */
export class GetUserEditHistoryUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorEditHistoryRepository} editHistoryRepository 編集履歴リポジトリ
     */
    constructor(
        private editHistoryRepository: CreatorEditHistoryRepository
    ) {}

    /**
     * ユーザー別編集履歴取得処理
     *
     * @param {string} userId ユーザーID
     * @param {number} limit 取得件数
     * @param {string} cursor カーソル（ページネーション用）
     * @return {object} 編集履歴とnextCursor
     */
    public async execute(
        userId: string,
        limit: number,
        cursor?: string
    ): Promise<{
        histories: CreatorEditHistory[];
        nextCursor?: string;
    }> {
        return this.editHistoryRepository.getByUserId(userId, limit, cursor);
    }
}
