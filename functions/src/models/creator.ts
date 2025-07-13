import type {Timestamp} from "firebase-admin/firestore";

/**
 * クリエイター情報のモデル定義
 */
export interface Creator {
    /** Firestore ドキュメントID */
    id: string;
    /** クリエイター名 */
    name: string;
    /** プロフィール画像のURL */
    profileImageUrl: string;
    /** クリエイターの説明文 */
    description: string;
    /** お気に入り登録数（非正規化） */
    favoriteCount: number;
    /** 各プラットフォームの情報 */
    platforms: {
      /** YouTube チャンネル情報 */
      youtube?: {
        /** YouTube上のユーザー名 */
        username: string;
        /** YouTubeチャンネルID */
        channelId: string;
        /** チャンネル登録者数 */
        subscriberCount: number;
        /** 総視聴回数 */
        viewCount?: number;
      };
      /** Twitch 情報 */
      twitch?: {
        /** Twitchプロフィールへのリンク */
        socialLink: string;
      };
      /** TikTok 情報 */
      tiktok?: {
        /** TikTokプロフィールへのリンク */
        socialLink: string;
      };
      /** Instagram 情報 */
      instagram?: {
        /** Instagramプロフィールへのリンク */
        socialLink: string;
      }
      /** ニコニコ動画 情報 */
      niconico?: {
        /** ニコニコ動画プロフィールへのリンク */
        socialLink: string;
      }
    };
    /** 直接設定されたタグIDの配列 */
    tags: string[];
    /** 表示用のタグ名配列 */
    tagNames: string[];
    /** 作成日時 */
    createdAt: Timestamp;
    /** 更新日時 */
    updatedAt: Timestamp;
}

/** Firestoreに保存する際の型（idとtagNamesを除外） */
export type CreatorDocument = Omit<Creator, "id" | "tagNames">;
