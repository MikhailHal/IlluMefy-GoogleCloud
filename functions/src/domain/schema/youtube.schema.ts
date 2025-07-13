import {z} from "zod";

/**
 * YouTubeチャンネルからクリエイター作成のリクエストボディスキーマ
 */
export const createCreatorFromYouTubeBodySchema = z.object({
    /** YouTubeチャンネルURL */
    channelUrl: z.string().min(1, "Channel URL is required"),
});

export type CreateCreatorFromYouTubeBody = z.infer<typeof createCreatorFromYouTubeBodySchema>;
