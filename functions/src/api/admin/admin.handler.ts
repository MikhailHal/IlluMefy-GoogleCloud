import {Response, NextFunction} from "express";
import {AuthRequest} from "../../middleware/auth";
import {CreateCreatorFromYouTubeUseCase} from "../../domain/usecase/CreateCreatorFromYouTube/CreateCreatorFromYouTubeUseCase";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {CreatorEditHistoryRepository} from "../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";
import {createCreatorFromYouTubeBodySchema} from "../../domain/schema/youtube.schema";
import {ZodError} from "zod";

/**
 * YouTubeチャンネルからクリエイター作成ハンドラー
 *
 * @param {AuthRequest} req リクエスト
 * @param {Response} res レスポンス
 * @param {NextFunction} next 次のミドルウェア
 */
export const createCreatorFromYouTubeHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        // 一時的に認証チェックを無効化
        // if (!req.user) {
        //     res.status(401).json({
        //         error: {
        //             message: "Unauthorized",
        //         },
        //     });
        //     return;
        // }

        const body = createCreatorFromYouTubeBodySchema.parse(req.body);

        const createCreatorFromYouTubeUseCase = new CreateCreatorFromYouTubeUseCase(
            new CreatorRepository(),
            new CreatorEditHistoryRepository()
        );

        const creatorId = await createCreatorFromYouTubeUseCase.execute(
            body.channelUrl,
            "test-user-id" // 一時的にテスト用ユーザーID
        );

        res.status(201).json({
            data: {
                id: creatorId,
                message: "Creator created successfully from YouTube channel",
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                error: {
                    message: "Invalid request parameters",
                    details: error.errors.map((e) => ({
                        field: e.path.join("."),
                        message: e.message,
                    })),
                },
            });
            return;
        }
        next(error);
    }
};
