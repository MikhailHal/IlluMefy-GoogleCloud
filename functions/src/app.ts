import express, {NextFunction, Request, Response} from "express";
import cors from "cors";

// handlerインポート
import healthRouter from "./api/health/health.router";
import {AppDetailCode, AppError} from "./base/error/AppError";

const app = express();

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
