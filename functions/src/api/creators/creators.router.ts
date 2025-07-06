import {Router} from "express";
import {
    popularCreatorHandler,
    searchCreatorsHandler,
    getCreatorByIdHandler,
} from "./creators.handler";

// ESLintが誤検知するため無効化
// eslint-disable-next-line new-cap
const router = Router();
router.get("/popular", popularCreatorHandler);
router.get("/search", searchCreatorsHandler);
router.get("/:id", getCreatorByIdHandler);
export default router;
