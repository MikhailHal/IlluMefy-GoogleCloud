import {Creator} from "../../../models/creator";
import {UserRepository} from "../../../repository/UserRepository/UserRepository";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";

/**
 * ユーザーのお気に入りクリエイター取得ユースケース
 */
export class GetUserFavoritesUseCase {
    /**
     * コンストラクタ
     *
     * @param {UserRepository} userRepository ユーザーリポジトリ
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private userRepository: UserRepository,
        private creatorRepository: CreatorRepository
    ) {}

    /**
     * お気に入りクリエイター取得処理
     *
     * @param {string} userId ユーザーID
     * @return {Creator[]} お気に入りクリエイター一覧
     */
    public async execute(userId: string): Promise<Creator[]> {
        const user = await this.userRepository.getUserById(userId);
        const creators: Creator[] = [];

        for (const creatorId of user.favoriteCreators) {
            const creator = await this.creatorRepository.getCreatorById(creatorId);
            if (creator) {
                creators.push(creator);
            } else {
                // クリエイターが削除されている場合はスキップ
                console.warn(`Creator ${creatorId} not found, skipping`);
            }
        }

        return creators;
    }
}
