import {UserRepository} from "../../../repository/UserRepository/UserRepository";

/**
 * 検索履歴追加ユースケース
 */
export class AddSearchHistoryUseCase {
    /**
     * コンストラクタ
     *
     * @param {UserRepository} userRepository ユーザーリポジトリ
     */
    constructor(
        private userRepository: UserRepository
    ) {}

    /**
     * 検索履歴追加処理
     *
     * @param {string} userId ユーザーID
     * @param {string[]} tagIds 検索に使用したタグIDの配列
     * @return {void}
     */
    public async execute(userId: string, tagIds: string[]): Promise<void> {
        return await this.userRepository.addSearchHistory(userId, tagIds);
    }
}
