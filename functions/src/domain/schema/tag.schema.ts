import {z} from "zod";

/**
 * タグIdスキーマ
 */
export const tagIdSchema = z.string().min(1);
