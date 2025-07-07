import {z} from "zod";

/**
 * 取得件数スキーマ
 */
export const fetchNumSchema = z.number().min(1);
