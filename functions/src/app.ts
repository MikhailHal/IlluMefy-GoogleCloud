import express, {NextFunction, Request, Response} from "express";
import cors from "cors";

// handlerインポート
import healthRouter from "./api/health/health.router";
import creatorsRouter from "./api/creators/creators.router";
import tagsRouter from "./api/tags/tags.router";
import usersRouter from "./api/users/users.router";
import {AppDetailCode, AppError} from "./base/error/AppError";
import {getSecret} from "./lib/secretManager/secretManager";
import {initializeOpenAi} from "./lib/openai/openai";

const app = express();

// OpenAI初期化（Function起動時に1回実行）
(async () => {
    try {
        const openaiApiKey = await getSecret("openai-api-key");
        initializeOpenAi(openaiApiKey);
        console.log("OpenAI initialized successfully");
    } catch (error) {
        console.error("Failed to initialize OpenAI:", error);
        process.exit(1); // 初期化失敗時はFunction終了
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
