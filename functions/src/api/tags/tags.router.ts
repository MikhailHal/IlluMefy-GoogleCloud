import {Router} from "express";
import {getAllTagsHandler, getPopularTagsHandler, createTagHandler, updateTagHandler, deleteTagHandler} from "./tags.handler";

// eslint-disable-next-line new-cap
const router = Router();

router.get("/", getAllTagsHandler);
router.get("/popular", getPopularTagsHandler);

// タグCRUD (ユーザー主導)
router.post("/", createTagHandler);
router.put("/:id", updateTagHandler);
router.delete("/:id", deleteTagHandler);

export default router;
