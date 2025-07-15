import express, {NextFunction, Request, Response} from "express";
import cors from "cors";

// handlerインポート
import healthRouter from "./api/health/health.router";
import creatorsRouter from "./api/creators/creators.router";
import tagsRouter from "./api/tags/tags.router";
import usersRouter from "./api/users/users.router";
import adminRouter from "./api/admin/admin.router";
import {AppDetailCode, AppError} from "./base/error/AppError";
import {getSecret} from "./lib/secretManager/secretManager";
import {initializeOpenAi} from "./lib/openai/openai";
import {initializeYouTube} from "./lib/youtube/youtube";
import {initializeBraveSearch} from "./lib/search/braveSearch";
import {initializeAnthropic} from "./lib/anthropic/anthropic";

const app = express();

// API初期化
(async () => {
    try {
        const openaiApiKey = await getSecret("openai-api-key");
        const youtubeDataApiKey = await getSecret("youtube-data-api-key");
        const braveSearchApiKey = await getSecret("brave-search-api-key");
        const anthropicApiKey = await getSecret("anthropic-api-key");
        initializeOpenAi(openaiApiKey);
        initializeYouTube(youtubeDataApiKey);
        initializeBraveSearch(braveSearchApiKey);
        initializeAnthropic(anthropicApiKey);
    } catch (error) {
        console.error("Failed to initialize api instance:", error);
        process.exit(1);
    }
})();

// CORS設定
app.use(cors({
    origin: true,
    credentials: true,
}));

// Express設定
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ルーティング設定
app.use("/health", healthRouter);
app.use("/creators", creatorsRouter);
app.use("/tags", tagsRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);

// 404エラーハンドリング
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: "Not Found",
    });
});

// エラーハンドリングミドルウェア
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                code: err.detailCode,
                message: err.message,
            },
        });
        return;
    }

    res.status(500).json({
        error: {
            code: AppDetailCode.InternalError,
            message: "Internal server error",
        },
    });
});

export default app;
