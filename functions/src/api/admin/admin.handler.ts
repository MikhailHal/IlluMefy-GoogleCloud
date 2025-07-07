import {Response, NextFunction} from "express";
import {AuthRequest} from "../../middleware/auth";
import {CreateCreatorUseCase} from "../../domain/usecase/CreateCreator/CreateCreatorUseCase";
import {UpdateCreatorUseCase} from "../../domain/usecase/UpdateCreator/UpdateCreatorUseCase";
import {DeleteCreatorUseCase} from "../../domain/usecase/DeleteCreator/DeleteCreatorUseCase";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {Timestamp} from "../../config/firebase/firebase";

export const createCreatorHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const createCreatorUseCase = new CreateCreatorUseCase(
            new CreatorRepository()
        );

        const creatorDocument = {
            ...req.body,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const creatorId = await createCreatorUseCase.execute(creatorDocument);
        res.status(201).json({
            data: {
                id: creatorId,
            },
            message: "Creator created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const updateCreatorHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {id} = req.params;
        if (!id) {
            res.status(400).json({
                error: {
                    message: "Creator ID is required",
                },
            });
            return;
        }

        const updateCreatorUseCase = new UpdateCreatorUseCase(
            new CreatorRepository()
        );

        const updates = {
            ...req.body,
            updatedAt: Timestamp.now(),
        };

        await updateCreatorUseCase.execute(id, updates);
        res.json({
            message: "Creator updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCreatorHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {id} = req.params;
        if (!id) {
            res.status(400).json({
                error: {
                    message: "Creator ID is required",
                },
            });
            return;
        }

        const deleteCreatorUseCase = new DeleteCreatorUseCase(
            new CreatorRepository()
        );

        await deleteCreatorUseCase.execute(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
