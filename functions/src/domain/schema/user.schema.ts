import {z} from "zod";
import {tagIdSchema} from "./tag.schema";
import {creatorIdSchema} from "./creator.schema";

/**
 * 検索履歴追加のボディスキーマ
 */
export const addSearchHistoryBodySchema = z.object({
    tagIds: z.array(tagIdSchema).min(1, "At least one tag ID is required"),
});

/**
 * クリエイターIDパラメータスキーマ
 */
export const creatorIdParamsSchema = z.object({
    creatorId: creatorIdSchema,
});
