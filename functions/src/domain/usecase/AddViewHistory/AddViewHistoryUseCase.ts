import {UserRepository} from "../../../repository/UserRepository/UserRepository";

/**
 * 閲覧履歴追加ユースケース
 */
export class AddViewHistoryUseCase {
    /**
     * コンストラクタ
     *
     * @param {UserRepository} userRepository ユーザーリポジトリ
     */
    constructor(
        private userRepository: UserRepository
    ) {}

    /**
     * 閲覧履歴追加処理
     *
     * @param {string} userId ユーザーID
     * @param {string} creatorId 閲覧したクリエイターのID
     * @return {void}
     */
    public async execute(userId: string, creatorId: string): Promise<void> {
        return await this.userRepository.addViewHistory(userId, creatorId);
    }
}
