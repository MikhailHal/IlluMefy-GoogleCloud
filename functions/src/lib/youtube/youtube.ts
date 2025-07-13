import {google} from "googleapis";
import {YouTubeChannel} from "../../models/youtubeChannel";
import {InternalServerError} from "../../base/error/InternalServerError";

const TAG = "Youtube Data API";

// apiキーは後から初期化
let youtube = google.youtube({
    version: "v3",
    auth: "",
});

/**
 * チャンネル詳細情報の取得
 *
 * @param {string} channelUrl チャンネルURL
 */
export async function getChannelDetail(channelUrl: string): Promise<YouTubeChannel | null> {
    try {
        const {id, isHandle} = extractChannelId(channelUrl);
        console.log(`[${TAG}] - Extracted id is ${id}`);
        console.log(`[${TAG}] - Fetch channel information!!`);
        if (!id) {
            throw new Error("Invalid YouTube channel URL");
        }

        let res;
        if (isHandle) {
            // @ハンドル形式の場合
            res = await youtube.channels.list({
                part: ["snippet", "statistics"],
                forHandle: id,
            });
        } else {
            // チャンネルID形式の場合
            res = await youtube.channels.list({
                part: ["snippet", "statistics"],
                id: [id],
            });
        }

        const channel = res.data.items?.[0];
        if (!channel) {
            return null;
        }
        console.log(`[${TAG}] - Succeed to fetch channel information!!`);
        return {
            id: channel.id || id,
            name: channel.snippet?.title || "",
            description: channel.snippet?.description || "",
            subscriberCount: Number(channel.statistics?.subscriberCount) || 0,
            totalWatchedCount: Number(channel.statistics?.viewCount) || 0,
            profileImageUrl: channel.snippet?.thumbnails?.high?.url || "",
        };
    } catch (error) {
        console.log(error);
        throw new InternalServerError(
            `[${TAG}] - Failed to get channel Info!!`
        );
    }
}

/**
 * YouTubeチャンネルURLからチャンネルIDを抽出
 *
 * @param {string} url チャンネルURL
 * @return {object} チャンネルIDとハンドル判定
 */
function extractChannelId(url: string): {id: string | null; isHandle: boolean} {
    // 動画URLの場合はNG
    if (url.match(/youtube\.com\/watch\?v=/) || url.match(/youtu\.be\//)) {
        return {id: null, isHandle: false};
    }

    // UC形式のチャンネルID (例: https://www.youtube.com/channel/UCxxxxxxx)
    const channelMatch = url.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
    if (channelMatch) {
        return {id: channelMatch[1], isHandle: false};
    }

    // @ハンドル形式 (例: https://www.youtube.com/@username)
    const handleMatch = url.match(/youtube\.com\/@([a-zA-Z0-9_-]+)/);
    if (handleMatch) {
        return {id: handleMatch[1], isHandle: true};
    }

    // カスタムURL形式 (例: https://www.youtube.com/c/username)
    const customMatch = url.match(/youtube\.com\/c\/([a-zA-Z0-9_-]+)/);
    if (customMatch) {
        return {id: customMatch[1], isHandle: true};
    }

    // user形式 (例: https://www.youtube.com/user/username)
    const userMatch = url.match(/youtube\.com\/user\/([a-zA-Z0-9_-]+)/);
    if (userMatch) {
        return {id: userMatch[1], isHandle: true};
    }
    return {id: null, isHandle: false};
}

/**
 * YouTube Data APIインスタンスの初期化
 *
 * @param {string} key APIキー
 */
export function initializeYouTube(key: string) {
    youtube = google.youtube({
        version: "v3",
        auth: key,
    });
    console.log(`[${TAG}] - Succeed to initialize the instance!`);
}
