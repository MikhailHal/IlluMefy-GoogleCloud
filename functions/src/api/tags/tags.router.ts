import {Router} from "express";
import {getAllTagsHandler, getPopularTagsHandler} from "./tags.handler";

// eslint-disable-next-line new-cap
const router = Router();

router.get("/", getAllTagsHandler);
router.get("/popular", getPopularTagsHandler);

export default router;
