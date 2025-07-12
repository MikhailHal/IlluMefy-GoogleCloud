import {Request, Response, NextFunction} from "express";
import {GetCreatorEditHistoryUseCase} from "../../domain/usecase/GetCreatorEditHistory/GetCreatorEditHistoryUseCase";
import {CreatorEditHistoryRepository} from "../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";
import {creatorIdSchema} from "../../domain/schema/creator.schema";
import {editHistoryQuerySchema} from "../../domain/schema/common/fetchNum.schema";
import {ZodError} from "zod";

/**
 * クリエイター別編集履歴取得ハンドラー
 *
 * @param {Request} req リクエスト
 * @param {Response} res レスポンス
 * @param {NextFunction} next 次のミドルウェア
 */
export const getCreatorEditHistoryHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {id} = req.params;
        creatorIdSchema.parse(id);

        const query = editHistoryQuerySchema.parse(req.query);

        const getCreatorEditHistoryUseCase = new GetCreatorEditHistoryUseCase(
            new CreatorEditHistoryRepository()
        );

        const result = await getCreatorEditHistoryUseCase.execute(
            id,
            query.limit,
            query.cursor
        );

        res.json({
            data: result,
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
