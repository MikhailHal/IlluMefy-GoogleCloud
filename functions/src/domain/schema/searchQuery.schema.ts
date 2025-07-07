import {z} from "zod";
import {tagIdSchema} from "./tag.schema";
import {fetchNumSchema} from "./common/fetchNum.schema";

/**
 * タグ検索クエリスキーマ
 */
export const tagSearchQuerySchema = z.object({
    q: tagIdSchema,
    limit: z.string().transform((val) => parseInt(val)).pipe(fetchNumSchema).optional(),
});
