import {Creator, CreatorDocument} from "../../../models/creator";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {CreatorEditHistoryRepository} from "../../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";
import {CreatorEditHistoryDocument} from "../../../models/creatorEditHistory";
import {TagRepository} from "../../../repository/TagRepository/TagRepository";
import {ValidationError} from "../../../base/error/ValidationError";
import {NotFoundCreatorError} from "../../../base/error/NotFoundCreatorError";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {EditReason, EditReasonType} from "../../enum/editReason";

/**
 * クリエイター更新ユースケース
 */
export class UpdateCreatorUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     * @param {CreatorEditHistoryRepository} editHistoryRepository 編集履歴リポジトリ
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository,
        private editHistoryRepository: CreatorEditHistoryRepository,
        private tagRepository: TagRepository
    ) {}

    /**
     * クリエイター更新処理
     *
     * @param {string} id クリエイターID
     * @param {Partial<CreatorDocument>} updates 更新するフィールド
     * @param {string} userId 編集者のユーザーID
     * @param {string} userPhoneNumber 編集者の電話番号（BAN用）
     * @param {EditReasonType} editReason 編集理由（デフォルト: EditReason.USER_EDIT）
     * @return {void}
     * @throws {ValidationError} 入力データが不正な場合
     * @throws {NotFoundCreatorError} クリエイターが見つからない場合
     */
    public async execute(
        id: string,
        updates: Partial<CreatorDocument>,
        userId: string,
        userPhoneNumber: string,
        editReason: EditReasonType = EditReason.USER_EDIT
    ): Promise<void> {
        // IDバリデーション
        if (!id || id.trim() === "") {
            throw new ValidationError("Creator ID is required");
        }

        // 更新データのバリデーション
        if (!updates || Object.keys(updates).length === 0) {
            throw new ValidationError("No update fields provided");
        }

        // 更新前のデータを取得（履歴記録用）
        const beforeData = await this.creatorRepository.getCreatorById(id);
        if (!beforeData) {
            throw new NotFoundCreatorError();
        }

        // 特定フィールドのバリデーション
        if (updates.name !== undefined && updates.name.trim() === "") {
            throw new ValidationError("Creator name cannot be empty");
        }

        if (updates.profileImageUrl !== undefined) {
            if (updates.profileImageUrl.trim() === "") {
                throw new ValidationError("Profile image URL cannot be empty");
            }
            try {
                new URL(updates.profileImageUrl);
            } catch {
                throw new ValidationError("Invalid profile image URL format");
            }
        }

        if (updates.platforms !== undefined && Object.keys(updates.platforms).length === 0) {
            throw new ValidationError("At least one platform is required");
        }

        // タグの重複削除
        if (updates.tags && updates.tags.length > 0) {
            updates.tags = [...new Set(updates.tags)];
        }

        // 更新実行
        await this.creatorRepository.updateCreator(id, updates);

        // 編集履歴の記録
        const editHistory = await this.buildEditHistory(beforeData, updates, userId, userPhoneNumber, editReason);
        if (editHistory) {
            await this.editHistoryRepository.save(editHistory);
        }
    }

    /**
     * 編集履歴を構築する
     *
     * @param {Creator} before 変更前のクリエイター情報
     * @param {Partial<CreatorDocument>} updates 更新内容
     * @param {string} userId 編集者のユーザーID
     * @param {string} userPhoneNumber 編集者の電話番号
     * @param {EditReasonType} editReason 編集理由
     * @return {CreatorEditHistoryDocument | null} 編集履歴（変更がない場合はnull）
     */
    private async buildEditHistory(
        before: Creator,
        updates: Partial<CreatorDocument>,
        userId: string,
        userPhoneNumber: string,
        editReason: EditReasonType
    ): Promise<CreatorEditHistoryDocument | null> {
        const changes: Partial<CreatorEditHistoryDocument> = {};
        let hasChanges = false;

        // 基本情報の変更検出
        const basicInfoChanges: Record<string, {before: string; after: string}> = {};
        if (updates.name && updates.name !== before.name) {
            basicInfoChanges.name = {before: before.name, after: updates.name};
            hasChanges = true;
        }
        if (updates.description && updates.description !== before.description) {
            basicInfoChanges.description = {before: before.description, after: updates.description};
            hasChanges = true;
        }
        if (updates.profileImageUrl && updates.profileImageUrl !== before.profileImageUrl) {
            basicInfoChanges.profileImageUrl = {before: before.profileImageUrl, after: updates.profileImageUrl};
            hasChanges = true;
        }
        if (Object.keys(basicInfoChanges).length > 0) {
            changes.basicInfoChanges = basicInfoChanges;
        }

        // SNSリンクの変更検出
        if (updates.platforms) {
            const socialLinksChanges: Record<string, {before: string; after: string}> = {};
            const platformKeys = ["youtubeUrl", "twitchUrl", "tiktokUrl", "instagramUrl", "niconicoUrl"] as const;

            platformKeys.forEach((key) => {
                const beforeValue = this.extractSocialLink(before.platforms, key);
                const afterValue = updates.platforms ? this.extractSocialLink(updates.platforms, key) : null;

                if (afterValue && afterValue !== beforeValue) {
                    socialLinksChanges[key] = {before: beforeValue || "", after: afterValue};
                    hasChanges = true;
                }
            });

            if (Object.keys(socialLinksChanges).length > 0) {
                changes.socialLinksChanges = socialLinksChanges;
            }
        }

        // タグの変更検出
        if (updates.tags) {
            const beforeSet = new Set(before.tags);
            const afterSet = new Set(updates.tags);

            const addedIds = [...afterSet].filter((id) => !beforeSet.has(id));
            const removedIds = [...beforeSet].filter((id) => !afterSet.has(id));

            if (addedIds.length > 0 || removedIds.length > 0) {
                // タグIDから名前に変換
                const addedNames = await this.tagRepository.getTagNamesByIds(addedIds);
                const removedNames = await this.tagRepository.getTagNamesByIds(removedIds);

                changes.tagsChanges = {
                    added: addedNames,
                    removed: removedNames,
                };
                hasChanges = true;
            }
        }

        // 変更がない場合はnullを返す
        if (!hasChanges) {
            return null;
        }

        return {
            creatorId: before.id,
            creatorName: before.name,
            userId,
            userPhoneNumber,
            editReason,
            timestamp: FieldValue.serverTimestamp() as unknown as Timestamp,
            ...changes,
        };
    }

    /**
     * プラットフォーム情報からソーシャルリンクを抽出
     *
     * @param {object} platforms プラットフォーム情報
     * @param {string} key 抽出するキー
     * @return {string | null} ソーシャルリンク
     */
    private extractSocialLink(platforms: Creator["platforms"], key: string): string | null {
        if (!platforms) return null;

        // プラットフォーム毎の構造に応じて抽出
        switch (key) {
        case "youtubeUrl":
            return platforms.youtube?.channelId ? `https://youtube.com/channel/${platforms.youtube.channelId}` : null;
        case "twitchUrl":
            return platforms.twitch?.socialLink || null;
        case "tiktokUrl":
            return platforms.tiktok?.socialLink || null;
        case "instagramUrl":
            return platforms.instagram?.socialLink || null;
        case "niconicoUrl":
            return platforms.niconico?.socialLink || null;
        default:
            return null;
        }
    }
}
