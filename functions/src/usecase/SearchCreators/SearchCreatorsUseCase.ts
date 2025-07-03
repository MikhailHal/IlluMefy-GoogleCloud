import {Creator} from "../../models/creator";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

/**
 * クリエイター検索ユースケース
 *
 * フラット構造のタグによるAND検索を行う
 */
export class SearchCreatorsUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository
    ) {}

    /**
     * タグIDを用いて全て満たすクリエイターを取得する
     *
     * @param {string[]} tagIds 検索対象のタグIDの配列
     * @param {number} fetchCount 取得件数
     * @return {Creator[]} 指定したタグ条件を満たすクリエイター情報
     */
    public async execute(tagIds: string[], fetchCount: number): Promise<Creator[]> {
        if (tagIds.length === 0) {
            return [];
        }

        return await this.creatorRepository.searchCreatorsByTags(tagIds, fetchCount);
    }
}
