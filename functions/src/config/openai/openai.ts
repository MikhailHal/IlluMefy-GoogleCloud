import OpenAI from "openai";
import {InternalServerError} from "../../base/error/InternalServerError";

// キーは初回使用時にセット
let openai = new OpenAI({apiKey: ""});

/**
 * ベクトル生成
 *
 * @param {string} rawValue ベクトル生成値
 * @return {number[]} 生成されたベクトル
 */
export async function createEmbedding(rawValue: string): Promise<number[]> {
    try {
        const res = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: rawValue,
        });
        return res.data[0].embedding;
    } catch (error) {
        throw new InternalServerError();
    }
}

/**
 * OpenAIインスタンスの初期化
 *
 * @param {string} key APIキー情報
 */
export function initializeOpenAi(key: string) {
    openai = new OpenAI({apiKey: key});
}
