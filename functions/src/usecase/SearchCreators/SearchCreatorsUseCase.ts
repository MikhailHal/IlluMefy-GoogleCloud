import {Creator} from "../../models/creator";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

/**
 * クリエイター検索ユースケース
 *
 * 動的計画法(Dynamic Programming)を用いることで配下子タグをO(1)で取得。
 * それらタグを利用してAND検索を行う。
 */
export class SearcgCreatorsUseCase {
    /**
     * コンストラクタ
     *
     * @param {CreatorRepository} creatorRepository クリエイターリポジトリ
     */
    constructor(
        private creatorRepository: CreatorRepository,
    ) {}

    /**
     * タグ情報を用いて全て満たすクリエイターを取得する
     *
     * @param {number} fetchCount 取得件数
     * @return {Creator[]} 指定したタグ条件を満たすクリエイター情報
     */
    public async execute(fetchCount: number): Promise<Creator[]> {
        return await this.creatorRepository.searchCreatorsByTags(
            [],
            fetchCount
        );
    }
}
