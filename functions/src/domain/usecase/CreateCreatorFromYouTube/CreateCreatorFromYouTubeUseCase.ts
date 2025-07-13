import {getChannelDetail} from "../../../lib/youtube/youtube";
import {CreateCreatorUseCase} from "../CreateCreator/CreateCreatorUseCase";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {CreatorEditHistoryRepository} from "../../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";
import {YouTubeChannel} from "../../../models/youtubeChannel";
import {CreatorDocument} from "../../../models/creator";
import {Timestamp} from "firebase-admin/firestore";
import {EditReason} from "../../enum/editReason";

/**
 * YouTubeチャンネルURLからクリエイターを作成するユースケース
 */
export class CreateCreatorFromYouTubeUseCase {
    private createCreatorUseCase: CreateCreatorUseCase;
    private editHistoryRepository: CreatorEditHistoryRepository;

    /**
     * コンストラクタ
     *
     * @param {ICreatorRepository} creatorRepository クリエイターリポジトリ
     * @param {ICreatorEditHistoryRepository} editHistoryRepository 編集履歴リポジトリ
     */
    constructor(
        creatorRepository: CreatorRepository,
        editHistoryRepository: CreatorEditHistoryRepository
    ) {
        this.createCreatorUseCase = new CreateCreatorUseCase(
            creatorRepository
        );
        this.editHistoryRepository = editHistoryRepository;
    }

    /**
     * YouTubeチャンネルURLからクリエイターを作成
     *
     * @param {string} channelUrl YouTubeチャンネルURL
     * @param {string} userId 作成者のユーザーID
     * @return {Promise<string>} 作成されたクリエイターのID
     */
    async execute(channelUrl: string, userId: string): Promise<string> {
        // YouTube Data APIからチャンネル情報を取得
        const youtubeChannel = await getChannelDetail(channelUrl);
        if (!youtubeChannel) {
            throw new Error("YouTube channel not found");
        }

        // YouTubeChannelをCreatorDocumentに変換
        const creatorDocument = this.convertYouTubeChannelToCreator(youtubeChannel);

        // 既存のCreateCreatorUseCaseを使用してクリエイターを作成
        const creatorId = await this.createCreatorUseCase.execute(creatorDocument);

        // 編集履歴を記録（YouTube APIから作成されたことを記録）
        try {
            console.log("[YouTube UseCase] - Starting to save edit history");

            const editHistoryData = {
                creatorId: creatorId,
                creatorName: creatorDocument.name,
                basicInfoChanges: {
                    name: {before: "", after: creatorDocument.name},
                    description: {before: "", after: creatorDocument.description},
                    profileImageUrl: {before: "", after: creatorDocument.profileImageUrl},
                },
                userId: userId,
                userPhoneNumber: "system",
                timestamp: Timestamp.now(),
                editReason: EditReason.MODERATION,
                moderatorNote: `YouTube APIから自動作成: ${channelUrl}`,
            };

            console.log("[YouTube UseCase] - Edit history data:", JSON.stringify(editHistoryData, null, 2));

            await this.editHistoryRepository.save(editHistoryData);
            console.log("[YouTube UseCase] - Edit history saved successfully");
        } catch (historyError) {
            console.log("[YouTube UseCase] - Failed to save edit history:", historyError);
        }

        return creatorId;
    }

    /**
     * YouTubeChannelをCreatorDocumentに変換
     *
     * @param {YouTubeChannel} channel YouTube チャンネル情報
     * @return {CreatorDocument} Creator ドキュメント
     */
    private convertYouTubeChannelToCreator(channel: YouTubeChannel): CreatorDocument {
        const now = Timestamp.now();

        return {
            name: channel.name,
            profileImageUrl: channel.profileImageUrl,
            description: channel.description,
            favoriteCount: 0,
            platforms: {
                youtube: {
                    username: channel.name,
                    channelId: channel.id,
                    subscriberCount: channel.subscriberCount,
                    viewCount: channel.totalWatchedCount,
                },
            },
            tags: [], // タグは後で別途追加
            createdAt: now,
            updatedAt: now,
        };
    }
}
