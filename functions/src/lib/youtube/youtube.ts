import {google} from "googleapis";
import {YouTubeChannel} from "../../models/youtubeChannel";
import {InternalServerError} from "../../base/error/InternalServerError";

const TAG = "Youtube Data API";

let apiKey = "";

// YouTube APIインスタンス（初期化後に設定）
let youtube: any = null;

/**
 * チャンネル詳細情報の取得
 *
 * @param {string} channelUrl チャンネルURL
 */
export async function getChannelDetail(channelUrl: string): Promise<YouTubeChannel | null> {
    try {
        console.log(`[${TAG}] - YouTube instance exists:`, !!youtube);
        console.log(`[${TAG}] - API key length:`, apiKey.length);

        // 初期化されていない場合は、Secret Managerから取得して初期化
        if (!youtube || !apiKey) {
            console.log(`[${TAG}] - YouTube not initialized, getting API key from Secret Manager`);
            const {getSecret} = await import("../secretManager/secretManager.js");
            const youtubeDataApiKey = await getSecret("youtube-data-api-key");
            initializeYouTube(youtubeDataApiKey);
            console.log(`[${TAG}] - YouTube re-initialized with key length:`, youtubeDataApiKey.length);
        }

        const {id, isHandle} = extractChannelId(channelUrl);
        console.log(`[${TAG}] - Extracted id is ${id}`);
        console.log(`[${TAG}] - Fetch channel information!!`);
        if (!id) {
            throw new Error("Invalid YouTube channel URL");
        }

        let res;
        if (isHandle) {
            // @ハンドル形式の場合
            console.log(`[${TAG}] - Using forHandle with value: ${id}`);
            try {
                res = await youtube.channels.list({
                    part: ["snippet", "statistics"],
                    forHandle: id,
                    key: apiKey,
                });
                console.log(`[${TAG}] - forHandle API response:`, JSON.stringify(res.data, null, 2));
            } catch (handleError) {
                console.log(`[${TAG}] - forHandle failed, trying forUsername:`, handleError);
                // forHandleが失敗した場合はforUsernameで試す
                res = await youtube.channels.list({
                    part: ["snippet", "statistics"],
                    forUsername: id,
                    key: apiKey,
                });
                console.log(`[${TAG}] - forUsername API response:`, JSON.stringify(res.data, null, 2));
            }
        } else {
            // チャンネルID形式の場合
            res = await youtube.channels.list({
                part: ["snippet", "statistics"],
                id: [id],
                key: apiKey,
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
    apiKey = key;
    console.log(`[${TAG}] - Initializing with API key length: ${key.length}`);

    try {
        youtube = google.youtube({
            version: "v3",
            auth: key,
        });
        console.log(`[${TAG}] - YouTube instance created:`, !!youtube);
        console.log(`[${TAG}] - YouTube.channels exists:`, !!youtube?.channels);
    } catch (error) {
        console.log(`[${TAG}] - Failed to create YouTube instance:`, error);
    }

    console.log(`[${TAG}] - Succeed to initialize the instance!`);
}
