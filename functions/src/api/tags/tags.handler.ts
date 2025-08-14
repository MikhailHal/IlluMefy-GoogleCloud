import {Request, Response, NextFunction} from "express";
import {GetAllTagsUseCase} from "../../domain/usecase/GetAllTags/GetAllTagsUseCase";
import {GetPopularTagsUseCase} from "../../domain/usecase/GetPopularTags/GetPopularTagsUseCase";
import {GetTagsByIdListUseCase} from "../../domain/usecase/GetTagsByIdList/GetTagsByIdListUseCase";
import {CreateTagUseCase} from "../../domain/usecase/CreateTag/CreateTagUseCase";
import {UpdateTagUseCase} from "../../domain/usecase/UpdateTag/UpdateTagUseCase";
import {DeleteTagUseCase} from "../../domain/usecase/DeleteTag/DeleteTagUseCase";
import {TagRepository} from "../../repository/TagRepository/TagRepository";
import {fetchNumSchema} from "../../domain/schema/common/fetchNum.schema";
import {createTagBodySchema, updateTagBodySchema, tagIdParamsSchema, tagIdListBodySchema} from "../../domain/schema/tag.schema";
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

export const createTagHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const body = createTagBodySchema.parse(req.body);

        const createTagUseCase = new CreateTagUseCase(
            new TagRepository()
        );

        const tagId = await createTagUseCase.execute(body.name, body.description);
        res.status(201).json({
            data: {
                id: tagId,
            },
            message: "Tag created successfully",
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

export const updateTagHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const params = tagIdParamsSchema.parse(req.params);
        const body = updateTagBodySchema.parse(req.body);

        const updateTagUseCase = new UpdateTagUseCase(
            new TagRepository()
        );

        await updateTagUseCase.execute(params.id, body);
        res.status(200).json({
            message: "Tag updated successfully",
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

export const deleteTagHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const params = tagIdParamsSchema.parse(req.params);

        const deleteTagUseCase = new DeleteTagUseCase(
            new TagRepository()
        );

        await deleteTagUseCase.execute(params.id);
        res.status(204).send();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                error: {
                    message: "Invalid tag ID format",
                },
            });
            return;
        }
        next(error);
    }
};

export const getTagListByIdListHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const body = tagIdListBodySchema.parse(req.body);

        const getTagsByIdListUseCase = new GetTagsByIdListUseCase(
            new TagRepository()
        );

        const tags = await getTagsByIdListUseCase.execute(body.tagIds);
        res.json({
            data: tags,
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
