import {NotFoundUserError} from "../../../base/error/NotFoundUserError";
import {NotFoundCreatorError} from "../../../base/error/NotFoundCreatorError";
import {ValidationError} from "../../../base/error/ValidationError";
import {UserRepository} from "../../../repository/UserRepository/UserRepository";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";

/**
 * お気に入りクリエイター追加ユースケース
 */
export class AddFavoriteCreatorUseCase {
    /**
     * コンストラクタ
     *
     * @param {UserRepository} userRepository ユーザーリポジトリ
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private userRepository: UserRepository,
        private creatorRepository: CreatorRepository,
    ) {}

    /**
     * お気に入りクリエイター追加処理
     *
     * @param {string} userId ユーザーID
     * @param {string} creatorId クリエイターID
     * @return {Promise<void>}
     * @throws {ValidationError} パラメータが不正な場合
     * @throws {NotFoundUserError} ユーザーが見つからない場合
     * @throws {NotFoundCreatorError} クリエイターが見つからない場合
     */
    public async execute(userId: string, creatorId: string): Promise<void> {
        // パラメータバリデーション
        if (!userId || userId.trim() === "") {
            throw new ValidationError("User ID is required");
        }
        if (!creatorId || creatorId.trim() === "") {
            throw new ValidationError("Creator ID is required");
        }

        // ユーザーの存在確認
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundUserError();
        }

        // クリエイターの存在確認
        const creator = await this.creatorRepository.getCreatorById(creatorId);
        if (!creator) {
            throw new NotFoundCreatorError();
        }

        // 既にお気に入りに追加済みかチェック
        if (user.favoriteCreators.includes(creatorId)) {
            return; // 既に追加済みの場合は何もしない
        }

        // お気に入りに追加
        await this.userRepository.addFavoriteCreator(userId, creatorId);
    }
}
