import {Creator} from "../../../models/creator";

/**
 * ユーザーのお気に入りクリエイター一覧取得ユースケースのインターフェース
 */
export interface GetUserFavoritesUseCaseInterface {
    /**
     * ユーザーのお気に入りクリエイター一覧を取得
     * @param {string} userId - ユーザーID
     * @return {Promise<Creator[]>} お気に入りクリエイター一覧
     */
    execute(userId: string): Promise<Creator[]>;
}
