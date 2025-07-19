import {getSecret} from "../secretManager/secretManager";

interface ToxicityScores {
    toxicity: number;
    severeToxicity: number;
    identityAttack: number;
    insult: number;
    profanity: number;
    threat: number;
}

let perspectiveApiKey = "";

/**
 * Perspective API初期化
 */
async function initializePerspective(): Promise<void> {
    if (!perspectiveApiKey) {
        perspectiveApiKey = await getSecret("perspective-api-key");
    }
}

/**
 * テキストの有害性を分析
 *
 * @param {string} text 分析するテキスト
 * @return {Promise<ToxicityScores>} 有害性スコア
 */
export async function analyzeToxicity(text: string): Promise<ToxicityScores> {
    await initializePerspective();

    const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${perspectiveApiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            comment: {text},
            requestedAttributes: {
                TOXICITY: {},
                SEVERE_TOXICITY: {},
                IDENTITY_ATTACK: {},
                INSULT: {},
                PROFANITY: {},
                THREAT: {},
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Perspective API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
        toxicity: data.attributeScores?.TOXICITY?.summaryScore?.value || 0,
        severeToxicity: data.attributeScores?.SEVERE_TOXICITY?.summaryScore?.value || 0,
        identityAttack: data.attributeScores?.IDENTITY_ATTACK?.summaryScore?.value || 0,
        insult: data.attributeScores?.INSULT?.summaryScore?.value || 0,
        profanity: data.attributeScores?.PROFANITY?.summaryScore?.value || 0,
        threat: data.attributeScores?.THREAT?.summaryScore?.value || 0,
    };
}

/**
 * テキストが有害かどうかを判定
 *
 * @param {string} text 判定するテキスト
 * @param {number} threshold 閾値（デフォルト: 0.7）
 * @return {Promise<boolean>} 有害と判定される場合はtrue
 */
export async function isToxic(text: string, threshold = 0.7): Promise<boolean> {
    const scores = await analyzeToxicity(text);

    return scores.toxicity > threshold ||
           scores.severeToxicity > threshold ||
           scores.identityAttack > threshold ||
           scores.insult > threshold ||
           scores.profanity > threshold ||
           scores.threat > threshold;
}
