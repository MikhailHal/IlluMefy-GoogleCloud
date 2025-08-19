import {Creator} from "../../../models/creator";
import {UserRepository} from "../../../repository/UserRepository/UserRepository";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {GetUserFavoritesUseCaseInterface} from "./GetUserFavoritesUseCaseInterface";

/**
 * ユーザーのお気に入りクリエイター取得ユースケース
 */
export class GetUserFavoritesUseCase implements GetUserFavoritesUseCaseInterface {
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
     * @return {Promise<Creator[]>} お気に入りクリエイター一覧
     */
    public async execute(userId: string): Promise<Creator[]> {
        if (!userId) {
            throw new Error("userId is required");
        }

        const favoriteCreatorIds = await this.userRepository.getFavoriteCreatorList(userId);

        if (favoriteCreatorIds.length === 0) {
            return [];
        }

        const creators = await this.creatorRepository.getCreatorsByIds(favoriteCreatorIds);
        return creators;
    }
}
