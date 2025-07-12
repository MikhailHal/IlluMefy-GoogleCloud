import {Response, NextFunction} from "express";
import {AuthRequest} from "../../middleware/auth";
import {GetUserFavoritesUseCase} from "../../domain/usecase/GetUserFavorites/GetUserFavoritesUseCase";
import {
    AddFavoriteCreatorUseCase,
} from "../../domain/usecase/AddFavoriteCreator/AddFavoriteCreatorUseCase";
import {AddSearchHistoryUseCase} from "../../domain/usecase/AddSearchHistory/AddSearchHistoryUseCase";
import {AddViewHistoryUseCase} from "../../domain/usecase/AddViewHistory/AddViewHistoryUseCase";
import {GetUserEditHistoryUseCase} from "../../domain/usecase/GetUserEditHistory/GetUserEditHistoryUseCase";
import {UserRepository} from "../../repository/UserRepository/UserRepository";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {CreatorEditHistoryRepository} from "../../repository/CreatorEditHistoryRepository/CreatorEditHistoryRepository";
import {addSearchHistoryBodySchema, creatorIdParamsSchema} from "../../domain/schema/user.schema";
import {editHistoryQuerySchema} from "../../domain/schema/common/fetchNum.schema";
import {ZodError} from "zod";

export const getUserFavoritesHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }

        const getUserFavoritesUseCase = new GetUserFavoritesUseCase(
            new UserRepository(),
            new CreatorRepository()
        );

        const favorites = await getUserFavoritesUseCase.execute(req.user.uid);
        res.json({
            data: favorites,
        });
    } catch (error) {
        next(error);
    }
};

export const addFavoriteHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }

        const params = creatorIdParamsSchema.parse(req.params);

        const addFavoriteCreatorUseCase = new AddFavoriteCreatorUseCase(
            new UserRepository(),
            new CreatorRepository()
        );

        await addFavoriteCreatorUseCase.execute(req.user.uid, params.creatorId);
        res.status(200).json({
            message: "Favorite added successfully",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                error: {
                    message: "Invalid creator ID format",
                },
            });
            return;
        }
        next(error);
    }
};

export const removeFavoriteHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }

        const params = creatorIdParamsSchema.parse(req.params);

        const userRepository = new UserRepository();
        await userRepository.removeFavoriteCreator(req.user.uid, params.creatorId);

        res.status(200).json({
            message: "Favorite removed successfully",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                error: {
                    message: "Invalid creator ID format",
                },
            });
            return;
        }
        next(error);
    }
};

export const addSearchHistoryHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }

        const body = addSearchHistoryBodySchema.parse(req.body);

        const addSearchHistoryUseCase = new AddSearchHistoryUseCase(
            new UserRepository()
        );

        await addSearchHistoryUseCase.execute(req.user.uid, body.tagIds);
        res.json({
            message: "Search history recorded successfully",
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

export const addViewHistoryHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }

        const params = creatorIdParamsSchema.parse(req.params);

        const addViewHistoryUseCase = new AddViewHistoryUseCase(
            new UserRepository()
        );

        await addViewHistoryUseCase.execute(req.user.uid, params.creatorId);
        res.json({
            message: "View history recorded successfully",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                error: {
                    message: "Invalid creator ID format",
                },
            });
            return;
        }
        next(error);
    }
};

/**
 * ユーザー別編集履歴取得ハンドラー
 *
 * @param {AuthRequest} req リクエスト
 * @param {Response} res レスポンス
 * @param {NextFunction} next 次のミドルウェア
 */
export const getUserEditHistoryHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }

        const query = editHistoryQuerySchema.parse(req.query);

        const getUserEditHistoryUseCase = new GetUserEditHistoryUseCase(
            new CreatorEditHistoryRepository()
        );

        const result = await getUserEditHistoryUseCase.execute(
            req.user.uid,
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
