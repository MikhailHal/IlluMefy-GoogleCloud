import {Response, NextFunction} from "express";
import {AuthRequest} from "../../middleware/auth";
import {GetUserFavoritesUseCase} from "../../usecase/GetUserFavorites/GetUserFavoritesUseCase";
import {
    AddFavoriteCreatorUseCase,
} from "../../usecase/AddFavoriteCreator/AddFavoriteCreatorUseCase";
import {UserRepository} from "../../repository/UserRepository/UserRepository";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";

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

        const {creatorId} = req.params;
        if (!creatorId) {
            res.status(400).json({
                error: {
                    message: "Creator ID is required",
                },
            });
            return;
        }

        const addFavoriteCreatorUseCase = new AddFavoriteCreatorUseCase(
            new UserRepository(),
            new CreatorRepository()
        );

        await addFavoriteCreatorUseCase.execute(req.user.uid, creatorId);
        res.status(200).json({
            message: "Favorite added successfully",
        });
    } catch (error) {
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

        const {creatorId} = req.params;
        if (!creatorId) {
            res.status(400).json({
                error: {
                    message: "Creator ID is required",
                },
            });
            return;
        }

        const userRepository = new UserRepository();
        await userRepository.removeFavoriteCreator(req.user.uid, creatorId);

        res.status(200).json({
            message: "Favorite removed successfully",
        });
    } catch (error) {
        next(error);
    }
};
