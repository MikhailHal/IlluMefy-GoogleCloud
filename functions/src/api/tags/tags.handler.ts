import {Request, Response, NextFunction} from "express";
import {GetAllTagsUseCase} from "../../usecase/GetAllTags/GetAllTagsUseCase";
import {GetPopularTagsUseCase} from "../../usecase/GetPopularTags/GetPopularTagsUseCase";
import {TagRepository} from "../../repository/TagRepository/TagRepository";

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
        const limit = parseInt(req.query.limit as string) || defaultLimitNum;

        const getPopularTagsUseCase = new GetPopularTagsUseCase(
            new TagRepository()
        );

        const tags = await getPopularTagsUseCase.execute(limit);
        res.json({
            data: tags,
        });
    } catch (error) {
        next(error);
    }
};
