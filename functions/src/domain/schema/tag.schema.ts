import {z} from "zod";

/**
 * タグIdスキーマ
 */
export const tagIdSchema = z.string().min(1);

/**
 * タグ名のスキーマ
 */
export const tagNameSchema = z.string()
    .min(1, "Tag name is required")
    .max(50, "Tag name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s-_]+$/, "Tag name contains invalid characters");

/**
 * タグ作成のボディスキーマ
 */
export const createTagBodySchema = z.object({
    name: tagNameSchema,
    description: z.string().max(200).optional(),
});

/**
 * タグ更新のボディスキーマ
 */
export const updateTagBodySchema = z.object({
    name: tagNameSchema.optional(),
    description: z.string().max(200).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

/**
 * タグIDパラメータスキーマ
 */
export const tagIdParamsSchema = z.object({
    id: tagIdSchema,
});

/**
 * タグIDリストボディスキーマ
 */
export const tagIdListBodySchema = z.object({
    tagIds: z.array(tagIdSchema).min(1, "At least one tag ID is required").max(50, "Maximum 50 tag IDs allowed"),
});
