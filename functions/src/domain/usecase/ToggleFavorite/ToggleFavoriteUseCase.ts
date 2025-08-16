import {ToggleFavoriteUseCaseProtocol} from "./ToggleFavoriteUseCaseProtocol";
import {UserRepository} from "../../../repository/UserRepository/UserRepository";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {FavoriteMode} from "../../../util/enum/FavoriteMode";
import {ValidationError} from "../../../base/error/ValidationError";
import {db} from "../../../lib/firebase/firebase";

/**
 * お気に入り切り替え
 */
export class ToggleFavoriteUseCase implements ToggleFavoriteUseCaseProtocol {
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
     * 実行
     *
     * @param {string} userId ユーザーID
     * @param {string} creatorId クリエイターID
     * @param {FavoriteMode} mode お気に入りモード
     */
    public async execute(userId: string, creatorId: string, mode: FavoriteMode): Promise<void> {
        if (!userId || !creatorId) {
            throw new ValidationError("userId and creatorId are required");
        }

        if (!Object.values(FavoriteMode).includes(mode)) {
            throw new ValidationError("Invalid favorite mode");
        }

        const batch = db.batch();
        this.userRepository.toggleFavorite(batch, userId, creatorId, mode);
        this.creatorRepository.toggleFavorite(batch, creatorId, mode);
        await batch.commit();
    }
}
