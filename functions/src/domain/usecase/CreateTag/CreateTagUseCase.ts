import {TagDocument} from "../../../models/tag";
import {TagRepository} from "../../../repository/TagRepository/TagRepository";
import {ValidationError} from "../../../base/error/ValidationError";
import {Timestamp} from "../../../lib/firebase/firebase";
import {createEmbedding} from "../../../lib/openai/openai";
import {FieldValue} from "@google-cloud/firestore";

/**
 * タグ作成ユースケース
 */
export class CreateTagUseCase {
    /**
     * コンストラクタ
     *
     * @param {TagRepository} tagRepository タグリポジトリ
     */
    constructor(
        private tagRepository: TagRepository
    ) {}

    /**
     * タグ作成処理
     *
     * @param {string} name タグ名
     * @param {string} description タグ説明（オプション）
     * @return {string} 作成したタグのID
     * @throws {ValidationError} タグ名が重複している場合
     */
    public async execute(name: string, description?: string): Promise<string> {
        // タグ名の重複チェック
        const existingTag = await this.tagRepository.getTagByName(name);
        if (existingTag) {
            throw new ValidationError("Tag name already exists", {name});
        }

        return await this.createOrGetExisting(name, description);
    }

    /**
     * タグ作成または既存タグ取得（YouTubeクリエイター作成用）
     *
     * @param {string} name タグ名
     * @param {string} description タグ説明（オプション）
     * @return {string} タグのID（既存または新規作成）
     */
    public async createOrGetExisting(name: string, description?: string): Promise<string> {
        // タグ名の完全一致チェック（既存があれば返す）
        const existingTag = await this.tagRepository.getTagByName(name);
        if (existingTag) {
            return existingTag.id;
        }

        const vector = await createEmbedding(name);
        const nearestTag = await this.tagRepository.getNearestTagByVector(vector);
        if (nearestTag) {
            // 0.0が最近傍であり1.0が最遠点となる（COSINEの場合）
            const distance = nearestTag[1];
            // 検証結果に基づく閾値設定（OpenAI text-embedding-3-small使用）:
            // - "apex" ↔ "Apex": 0.123 (大文字小文字の違い)
            // - "apex" ↔ "apex legends": 0.304 (語句の拡張)
            // - "apex" ↔ "エーペックス": 0.633 (言語間の表記揺れ)
            //
            // 閾値0.75により上記の表記揺れを全て検出し、統合処理を行う
            // より曖昧な類似は除外され、全く異なるタグ（fortnite等）は別タグとして作成
            if (distance <= 0.75) {
                // 近しいものがある場合はそれを指定する。
                return nearestTag[0].id;
            }
        }

        const tagDocument: TagDocument = {
            name,
            description: description || "",
            viewCount: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            vector: FieldValue.vector(vector),
        };

        return await this.tagRepository.addTag(tagDocument);
    }
}
