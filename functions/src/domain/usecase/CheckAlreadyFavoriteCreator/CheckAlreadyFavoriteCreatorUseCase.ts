import {CheckAlreadyFavoriteCreatorUseCaseInterface} from "./CheckAlreadyFavoriteCreatorUseCaseInterface";
import {UserRepository} from "../../../repository/UserRepository/UserRepository";
import {ValidationError} from "../../../base/error/ValidationError";

/**
 * お気に入り済みチェック
 */
export class CheckAlreadyFavoriteCreatorUseCase implements CheckAlreadyFavoriteCreatorUseCaseInterface {
    /**
     * コンストラクタ
     *
     * @param {UserRepository} userRepository ユーザーリポジトリ
     */
    constructor(
        private userRepository: UserRepository
    ) {}

    /**
     * 実行
     *
     * @param {string} userId ユーザーID
     * @param {string} creatorId クリエイターID
     * @return {Promise<boolean>} お気に入り済みかどうか
     */
    public async execute(userId: string, creatorId: string): Promise<boolean> {
        if (!userId || !creatorId) {
            throw new ValidationError("userId and creatorId are required");
        }

        return await this.userRepository.isFavorite(userId, creatorId);
    }
}
