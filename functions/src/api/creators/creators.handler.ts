import {Request, Response, NextFunction} from "express";
import {GetPopularCreatorsUseCase} from "../../usecase/GetPopularCreator/GetPopularCreatorsUseCase";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

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
        console.error("Popular creators handler error:", error);
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
