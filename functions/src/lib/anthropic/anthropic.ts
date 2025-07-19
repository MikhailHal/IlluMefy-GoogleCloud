import Anthropic from "@anthropic-ai/sdk";
import {InternalServerError} from "../../base/error/InternalServerError";

const TAG = "Anthropic API";

let anthropic: Anthropic;

/**
 * Anthropic APIの初期化
 *
 * @param {string} key APIキー
 */
export function initializeAnthropic(key: string) {
    anthropic = new Anthropic({apiKey: key});
    console.log(`[${TAG}] - Succeed to initialize the instance!`);
}

/**
 * プロンプト実行
 *
 * @param {string} prompt プロンプト
 * @return {string} AIからの回答
 */
export async function execPrompt(prompt: string): Promise<string> {
    if (!(await isInitializedInstance())) {
        throw new InternalServerError(`[${TAG}] - API key not initialized`);
    }

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 2000,
            temperature: 0,
            messages: [{"role": "user", "content": prompt}],
        });

        const textContent = response.content.find((content) => content.type === "text");
        if (!textContent || textContent.type !== "text") {
            throw new InternalServerError(`[${TAG}] - No text content found in response`);
        }

        return textContent.text;
    } catch (error) {
        console.error(`[${TAG}] - Error executing prompt:`, error);
        throw new InternalServerError(`[${TAG}] - Failed to execute prompt`);
    }
}

/**
 * Anthropicインスタンスが初期化されたかどうかチェック
 *
 * @return {boolean} 初期化済みかどうか
 */
async function isInitializedInstance(): Promise<boolean> {
    let retryCount = 0;
    const maxRetries = 10;
    while (!anthropic && retryCount < maxRetries) {
        console.log(`[${TAG}] - Waiting for API key initialization... (${retryCount + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        retryCount++;
    }

    if (!anthropic) {
        console.error(`[${TAG}] - API key not initialized after ${maxRetries} retries`);
        return false;
    }
    return true;
}
