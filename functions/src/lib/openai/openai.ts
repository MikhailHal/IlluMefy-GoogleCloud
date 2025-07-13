import OpenAI from "openai";
import {InternalServerError} from "../../base/error/InternalServerError";

const TAG = "OpenAI API";
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
        console.log(`[${TAG}] - Succeed to create the embed!`);
        return res.data[0].embedding;
    } catch (error) {
        console.log(`[${TAG}] - Failed to create the embed!`);
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
    console.log(`[${TAG}] - Succeed to initialize the instance!`);
}
