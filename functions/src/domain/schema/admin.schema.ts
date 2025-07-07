import {z} from "zod";
import {creatorIdSchema} from "./creator.schema";

/**
 * クリエイター作成のボディスキーマ
 */
export const createCreatorBodySchema = z.object({
    name: z.string().min(1).max(100),
    profileImageUrl: z.string().url(),
    description: z.string().max(1000),
    platforms: z.object({
        youtube: z.object({
            username: z.string(),
            channelId: z.string(),
            subscriberCount: z.number().min(0),
        }).optional(),
        twitch: z.object({
            socialLink: z.string().url(),
        }).optional(),
        tiktok: z.object({
            socialLink: z.string().url(),
        }).optional(),
        instagram: z.object({
            socialLink: z.string().url(),
        }).optional(),
        niconico: z.object({
            socialLink: z.string().url(),
        }).optional(),
    }).refine((obj) => Object.keys(obj).length > 0, {
        message: "At least one platform is required",
    }),
    tags: z.array(z.string()).min(1).max(20),
    favoriteCount: z.number().min(0).default(0),
});

/**
 * クリエイター更新のボディスキーマ
 */
export const updateCreatorBodySchema = createCreatorBodySchema.partial();

/**
 * クリエイターIDパラメータスキーマ
 */
export const creatorIdParamsSchema = z.object({
    id: creatorIdSchema,
});
