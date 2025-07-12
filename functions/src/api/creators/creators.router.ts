import {Router} from "express";
import {
    popularCreatorHandler,
    searchCreatorsHandler,
    getCreatorByIdHandler,
    createCreatorHandler,
    updateCreatorHandler,
    deleteCreatorHandler,
} from "./creators.handler";
import {
    getCreatorEditHistoryHandler,
} from "./creatorEditHistory.handler";
import {verifyAuth} from "../../middleware/auth";

// ESLintが誤検知するため無効化
// eslint-disable-next-line new-cap
const router = Router();

// Public endpoints
router.get("/popular", popularCreatorHandler);
router.get("/search", searchCreatorsHandler);
router.get("/:id", getCreatorByIdHandler);
router.get("/:id/edit-history", getCreatorEditHistoryHandler);

// Authenticated endpoints
router.post("/", verifyAuth, createCreatorHandler);
router.put("/:id", verifyAuth, updateCreatorHandler);
router.delete("/:id", verifyAuth, deleteCreatorHandler);

export default router;
