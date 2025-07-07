import {Request, Response, NextFunction} from "express";
import {GetPopularCreatorsUseCase} from "../../domain/usecase/GetPopularCreator/GetPopularCreatorsUseCase";
import {SearchCreatorsUseCase} from "../../domain/usecase/SearchCreators/SearchCreatorsUseCase";
import {GetCreatorByIdUseCase} from "../../domain/usecase/GetCreatorById/GetCreatorByIdUseCase";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {creatorIdSchema} from "../../domain/schema/creator.schema";
import {ZodError} from "zod";
import {tagSearchQuerySchema} from "../../domain/schema/searchQuery.schema";
import {fetchNumSchema} from "../../domain/schema/common/fetchNum.schema";

export const popularCreatorHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const defaultLimitNum = 20;
        const limit = req.query.limit ?
            fetchNumSchema.parse(parseInt(req.query.limit as string)) :
            defaultLimitNum;

        const getPopularCreatorsUseCase = new GetPopularCreatorsUseCase(
            new CreatorRepository()
        );

        const creators = await getPopularCreatorsUseCase.execute(limit);
        res.json({
            data: creators,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                error: {
                    message: "Invalid limit parameter. Must be a number greater than 0",
                },
            });
            return;
        }
        next(error);
    }
};

export const searchCreatorsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const defaultLimitNum = 20;
        const query = tagSearchQuerySchema.parse(req.query);
        const searchCreatorsUseCase = new SearchCreatorsUseCase(
            new CreatorRepository()
        );

        // 複数タグのAND検索（Firestore制限によりハイブリッド方式）
        const tagIds = query.q.split(",").map((tag) => tag.trim()).filter((tag) => tag);
        const limit = query.limit || defaultLimitNum;
        const creators = await searchCreatorsUseCase.execute(tagIds, limit);
        res.json({
            data: creators,
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
        } else if (error instanceof Error) {
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
