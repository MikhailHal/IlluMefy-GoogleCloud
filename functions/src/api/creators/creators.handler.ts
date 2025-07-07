import {Request, Response, NextFunction} from "express";
import {GetPopularCreatorsUseCase} from "../../domain/usecase/GetPopularCreator/GetPopularCreatorsUseCase";
import {SearchCreatorsUseCase} from "../../domain/usecase/SearchCreators/SearchCreatorsUseCase";
import {GetCreatorByIdUseCase} from "../../domain/usecase/GetCreatorById/GetCreatorByIdUseCase";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {creatorIdSchema} from "../../domain/schema/creator.schema";
import {ZodError} from "zod";

export const popularCreatorHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const defaultLimitNum = 20;
        const limit = parseInt(req.query.limit as string) || defaultLimitNum;

        const getPopularCreatorsUseCase = new GetPopularCreatorsUseCase(
            new CreatorRepository()
        );

        const creators = await getPopularCreatorsUseCase.execute(limit);
        res.json({
            data: creators,
        });
    } catch (error) {
        next(error);
    }
};

export const searchCreatorsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const query = req.query.q as string;
        if (!query) {
            res.status(400).json({
                error: {
                    message: "Query parameter 'q' is required. Please provide comma-separated tag IDs (e.g., ?q=tag1,tag2,tag3)",
                },
            });
            return;
        }

        const searchCreatorsUseCase = new SearchCreatorsUseCase(
            new CreatorRepository()
        );

        // 複数タグのAND検索（Firestore制限によりハイブリッド方式）
        const tagIds = query.split(",").map((tag) => tag.trim()).filter((tag) => tag);
        const defaultLimitNum = 20;
        const limit = parseInt(req.query.limit as string) || defaultLimitNum;

        const creators = await searchCreatorsUseCase.execute(tagIds, limit);
        res.json({
            data: creators,
        });
    } catch (error) {
        console.error("Search creators handler error:", error);
        if (error instanceof Error) {
            res.status(500).json({
                error: {
                    message: "Internal server error",
                    detail: error.message,
                    stack: error.stack,
                },
            });
        } else {
            next(error);
        }
    }
};

export const getCreatorByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {id} = req.params;
        creatorIdSchema.parse(id);

        const getCreatorByIdUseCase = new GetCreatorByIdUseCase(
            new CreatorRepository()
        );

        const creator = await getCreatorByIdUseCase.execute(id);
        res.json({
            data: creator,
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
