import express from "express";
import cors from "cors";

// handlerインポート
import healthRouter from "./api/health/health.router";

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
app.use((_, res) => {
    res.status(404).json({
        error: "Not Found",
    });
});

export default app;
