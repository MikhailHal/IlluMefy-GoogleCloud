import {z} from "zod";

/**
 * クリエイターIdのスキーマ
 */
export const creatorIdSchema = z.string().min(1);
