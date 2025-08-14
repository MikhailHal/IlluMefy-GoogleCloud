import {Router} from "express";
import {getAllTagsHandler, getPopularTagsHandler, getTagListByIdListHandler, createTagHandler, updateTagHandler, deleteTagHandler} from "./tags.handler";

// eslint-disable-next-line new-cap
const router = Router();

router.get("/", getAllTagsHandler);
router.get("/popular", getPopularTagsHandler);
router.post("/by-ids", getTagListByIdListHandler);

// タグCRUD (ユーザー主導)
router.post("/", createTagHandler);
router.put("/:id", updateTagHandler);
router.delete("/:id", deleteTagHandler);

export default router;
