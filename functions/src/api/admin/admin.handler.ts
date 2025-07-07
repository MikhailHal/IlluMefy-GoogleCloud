import {Response, NextFunction} from "express";
import {AuthRequest} from "../../middleware/auth";
import {CreateCreatorUseCase} from "../../domain/usecase/CreateCreator/CreateCreatorUseCase";
import {UpdateCreatorUseCase} from "../../domain/usecase/UpdateCreator/UpdateCreatorUseCase";
import {DeleteCreatorUseCase} from "../../domain/usecase/DeleteCreator/DeleteCreatorUseCase";
import {CreatorRepository} from "../../repository/CreatorRepository/CreatorRepository";
import {Timestamp} from "../../config/firebase/firebase";
import {createCreatorBodySchema, updateCreatorBodySchema, creatorIdParamsSchema} from "../../domain/schema/admin.schema";
import {ZodError} from "zod";

export const createCreatorHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const body = createCreatorBodySchema.parse(req.body);

        const createCreatorUseCase = new CreateCreatorUseCase(
            new CreatorRepository()
        );

        const creatorDocument = {
            ...body,
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

export const updateCreatorHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const params = creatorIdParamsSchema.parse(req.params);
        const body = updateCreatorBodySchema.parse(req.body);

        const updateCreatorUseCase = new UpdateCreatorUseCase(
            new CreatorRepository()
        );

        const updates = {
            ...body,
            updatedAt: Timestamp.now(),
        };

        await updateCreatorUseCase.execute(params.id, updates);
        res.json({
            message: "Creator updated successfully",
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

export const deleteCreatorHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const params = creatorIdParamsSchema.parse(req.params);

        const deleteCreatorUseCase = new DeleteCreatorUseCase(
            new CreatorRepository()
        );

        await deleteCreatorUseCase.execute(params.id);
        res.status(204).send();
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
