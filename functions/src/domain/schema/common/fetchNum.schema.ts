import {z} from "zod";

/**
 * 取得件数スキーマ
 */
export const fetchNumSchema = z.number().min(1);

/**
 * 編集履歴取得用パラメータスキーマ
 */
export const editHistoryQuerySchema = z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(50),
    cursor: z.string().optional(),
});
