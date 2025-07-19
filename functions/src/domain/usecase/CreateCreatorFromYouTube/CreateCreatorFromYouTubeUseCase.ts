import {getChannelDetail} from "../../../lib/youtube/youtube";
import {CreateCreatorUseCase} from "../CreateCreator/CreateCreatorUseCase";
import {CreatorRepository} from "../../../repository/CreatorRepository/CreatorRepository";
import {CreatorEditHistoryRepository} from "../../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";
import {YouTubeChannel} from "../../../models/youtubeChannel";
import {CreatorDocument} from "../../../models/creator";
import {Timestamp} from "firebase-admin/firestore";
import {EditReason} from "../../enum/editReason";
import {searchWeb} from "../../../lib/search/braveSearch";
import {execPrompt} from "../../../lib/anthropic/anthropic";
import {CreateTagUseCase} from "../CreateTag/CreateTagUseCase";
import {TagRepository} from "../../../repository/TagRepository/TagRepository";

// 検索結果の型定義
interface SearchResults {
    [key: string]: Array<{
        title: string;
        url: string;
        description: string;
    }>;
}

// 検索結果のメタデータ
const SEARCH_CATEGORIES = {
    clip: {label: "切り抜き関連情報", query: "切り抜き"},
    featured: {label: "特徴・評価情報", query: "特徴"},
    impression: {label: "モノマネ情報", query: "モノマネ"},
    voiceImpression: {label: "声真似情報", query: "声真似"},
} as const;

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

        // タグを生成（MCPツールを使った自律的な調査）
        const generatedTags = await this.generateTagsFromChannelInfo(youtubeChannel);

        // タグマスターに登録（表記揺れチェック付き）
        const registeredTagIds = await this.registerTagsWithSimilarityCheck(generatedTags, youtubeChannel.name);

        // YouTubeChannelをCreatorDocumentに変換（登録されたタグIDを含む）
        const creatorDocument = this.convertYouTubeChannelToCreator(youtubeChannel, registeredTagIds);

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
     * チャンネル情報からタグを生成
     *
     * @param {YouTubeChannel} channel YouTube チャンネル情報
     * @return {Promise<string[]>} 生成されたタグ
     */
    private async generateTagsFromChannelInfo(channel: YouTubeChannel): Promise<string[]> {
        try {
            // プロンプトは検索結果と合わせて生成

            // タグ生成に必要な情報をWeb検索（レート制限対策のためfor文で1sec間隔で実行）
            const searchResults: SearchResults = {};
            const searchEntries = Object.entries(SEARCH_CATEGORIES);

            for (let i = 0; i < searchEntries.length; i++) {
                const [key, config] = searchEntries[i];
                try {
                    console.log(`[YouTube UseCase] - Searching ${i + 1}/${searchEntries.length}: ${key}`);
                    searchResults[key] = await searchWeb(`${channel.name} ${config.query}`);

                    // 最後の検索以外は1秒待機（レート制限対策）
                    if (i < searchEntries.length - 1) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`[YouTube UseCase] - Search failed for ${key}:`, error);
                    searchResults[key] = [];
                }
            }

            const promptWithResults = this.getPrompt(channel, searchResults);
            const response = await execPrompt(promptWithResults);
            console.log("[YouTube UseCase] - Raw response:", response);

            let tags: string[] = [];
            try {
                // JSONレスポンスをパース
                const jsonMatch = response.match(/\{[\s\S]*?"tags"[\s\S]*?:\s*\[[\s\S]*?\]\s*\}/);
                if (jsonMatch) {
                    // JSON全体をパース
                    const jsonString = jsonMatch[0];
                    const parsed = JSON.parse(jsonString);
                    if (parsed.tags && Array.isArray(parsed.tags)) {
                        tags = parsed.tags;
                    }
                }

                // JSONパースが失敗した場合はフォールバック
                if (tags.length === 0) {
                    const lines = response.split("\n");
                    for (const line of lines) {
                        if (line.includes(",") && line.trim().length > 10) {
                            tags = line.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0 && tag.length < 20);
                            break;
                        }
                    }
                }
            } catch (error) {
                console.log("[YouTube UseCase] - JSON parse failed, using fallback");
                tags = ["配信者", "YouTuber", "エンタメ"];
            }

            console.log("[YouTube UseCase] - Extracted tags:", tags);

            return tags;
        } catch (error) {
            console.log("[YouTube UseCase] - Failed to generate tags:", error);
            return ["配信者", "YouTuber", "エンタメ"]; // デフォルトタグ
        }
    }

    /**
     * タグマスターへの登録（表記揺れチェック付き）
     *
     * @param {string[]} tagNames タグ名の配列
     * @param {string} channelName チャンネル名
     * @return {Promise<string[]>} 登録されたタグIDの配列
     */
    private async registerTagsWithSimilarityCheck(tagNames: string[], channelName: string): Promise<string[]> {
        const BATCH_SIZE = 5; // 同時実行数を制限（OpenAI APIのレート制限を考慮）
        const registeredTagIds: string[] = [];
        const createTagUseCase = new CreateTagUseCase(new TagRepository());

        console.log(`[YouTube UseCase] - Starting tag registration for ${tagNames.length} tags`);

        for (let i = 0; i < tagNames.length; i += BATCH_SIZE) {
            const batch = tagNames.slice(i, i + BATCH_SIZE);
            console.log(`[YouTube UseCase] - Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(tagNames.length / BATCH_SIZE)}`);

            const batchResults = await Promise.all(
                batch.map(async (tagName) => {
                    try {
                        // CreateTagUseCaseのcreateOrGetExistingが以下を自動で処理:
                        // 1. 完全一致する既存タグがあればそのIDを返す
                        // 2. ベクトル類似度0.75以下の類似タグがあれば既存タグのIDを返す
                        // 3. 類似タグがなければ新規作成してIDを返す
                        const tagId = await createTagUseCase.createOrGetExisting(tagName, `${channelName}関連のタグ`);
    
                        console.log(`[YouTube UseCase] - Tag processed: "${tagName}" -> ID: ${tagId}`);
                        return tagId;
                    } catch (error) {
                        console.error(`[YouTube UseCase] - Failed to process tag "${tagName}":`, error);
                        return null;
                    }
                })
            );

            // null以外のタグIDを追加
            registeredTagIds.push(...batchResults.filter((id): id is string => id !== null));

            // 最後のバッチ以外は少し待機（APIレート制限対策）
            if (i + BATCH_SIZE < tagNames.length) {
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
        }

        // 重複するタグIDを除去
        const uniqueTagIds = [...new Set(registeredTagIds)];
        return uniqueTagIds;
    }

    /**
     * YouTubeChannelをCreatorDocumentに変換
     *
     * @param {YouTubeChannel} channel YouTube チャンネル情報
     * @param {string[]} tags 登録されたタグIDの配列
     * @return {CreatorDocument} Creator ドキュメント
     */
    private convertYouTubeChannelToCreator(channel: YouTubeChannel, tags: string[] = []): CreatorDocument {
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
            tags: tags,
            createdAt: now,
            updatedAt: now,
        };
    }

    /**
     * プロンプト取得
     *
     * @param {YouTubeChannel} channel チャンネル情報
     * @param {SearchResults} searchResults 検索結果
     * @return {string} プロンプト
     */
    private getPrompt(channel: YouTubeChannel, searchResults: SearchResults): string {
        // 検索結果セクションを自動生成
        const searchResultsSection = Object.entries(searchResults)
            .map(([key, results]) => {
                const config = SEARCH_CATEGORIES[key as keyof typeof SEARCH_CATEGORIES];
                const label = config?.label || `${key}情報`;
                return `■ ${label}:
${JSON.stringify(results, null, 2)}`;
            })
            .join("\n\n");

        return `チャンネル名: ${channel.name}
説明: ${channel.description}

【Web検索結果】
${searchResultsSection}

上記のWeb検索結果を参考に、以下の観点で分析してください：
1. チャンネルの主要コンテンツ
2. ターゲット層（10-20代ゲーマー向けかどうか）
3. 関連するゲームタイトルやジャンル

【タグ生成プロセス】
1. 候補タグを30個リストアップ
2. 各タグを以下のチェックリストで確認(ただし各チェックリスト毎に全てのタグを走査すること)：
□ 声真似及び物真似チェック：声真似または物真似の場合は何の真似かもタグに追加すること
□ 語尾チェック：〜集、〜配信、〜シーンなら削除
□ NGワードチェック：以下を含むなら削除
- デバイス、マウス、キーボード
- センス、力（〜力）
- 配信者、ストリーマー、実況者、プロゲーマー
- 食レポなどゲーム要素及び本人の特徴に関連のないもの
- 実況(〜実況)
- ゲーム、プレイ、ゲーム攻略など一般的な用語(例え関連性があってもNG)
□ 形容詞チェック：単独の形容詞なら削除
□ 複合語チェック：
- 「〇〇所属」→「〇〇」のみ
- 「神〇〇」「高速〇〇」→「〇〇」のみ
- 「xxモノマネ」→「xx」 + 「モノマネ」
- 「xx声真似」→「xx」 + 「声真似」
□ ゲーム名チェック：略称があれば統一（Call of Duty→CoD）
□ クリエイター名チェック：検索しているクリエイター自身のタグは含めない
□ タグ性質チェック1：タグがクリエイター自身の特徴を表していること
□ タグ性質チェック2：あなたが10-20代のゲーマーだった場合にこのタグで探したいと思うかどうか確認すること
□ タグ性質チェック3：ゲーマー要素と関連の薄いタグ(都市伝説・炎上)は例えコンテンツの一部としてあっても排除すること
□ タグ性質チェック4：一過性のコンテンツではなく永続的もしくは非常に流行したもの以外は排除すること
□ タグ性質チェック5: ゲーム、プレイ、ゲーム攻略など一般的な用語(例え関連性があってもNG)
3. チェック結果を「✓残す」「✗削除（理由）」で表示
4. 残したもののみ返却

【必ず残すカテゴリ】
- ゲームタイトル
- ゲーム用語（爪痕、ハンマー等）
- 定番複合語（感度設定、切り抜き、初心者講座）
- 調査で複数回確認された特徴

【出力形式】
{"tags": [...]}`;
    }
}
