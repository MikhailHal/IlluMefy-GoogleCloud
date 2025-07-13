/**
 * YouTubeチャンネル情報
 */
export interface YouTubeChannel {
    /** チャンネルId */
    id: string,
    /** チャンネル名 */
    name: string,
    /** 登録者数 */
    subscriberCount: number,
    /** プロフィール画像Url */
    profileImageUrl: string,
    /** チャンネル説明 */
    description: string,
    /** 総視聴回数 */
    totalWatchedCount: number,
}
