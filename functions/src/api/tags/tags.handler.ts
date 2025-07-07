import {Request, Response, NextFunction} from "express";
import {GetAllTagsUseCase} from "../../domain/usecase/GetAllTags/GetAllTagsUseCase";
import {GetPopularTagsUseCase} from "../../domain/usecase/GetPopularTags/GetPopularTagsUseCase";
import {TagRepository} from "../../repository/TagRepository/TagRepository";
import {fetchNumSchema} from "../../domain/schema/common/fetchNum.schema";
import {ZodError} from "zod";

export const getAllTagsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const getAllTagsUseCase = new GetAllTagsUseCase(
            new TagRepository()
        );

        const tags = await getAllTagsUseCase.execute();
        res.json({
            data: tags,
        });
    } catch (error) {
        next(error);
    }
};

export const getPopularTagsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const defaultLimitNum = 10;
        const limit = req.query.limit ?
            fetchNumSchema.parse(parseInt(req.query.limit as string)) :
            defaultLimitNum;

        const getPopularTagsUseCase = new GetPopularTagsUseCase(
            new TagRepository()
        );

        const tags = await getPopularTagsUseCase.execute(limit);
        res.json({
            data: tags,
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
