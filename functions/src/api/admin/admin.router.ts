import {Router} from "express";
import {verifyAuth} from "../../middleware/auth";
import {
    createCreatorHandler,
    updateCreatorHandler,
    deleteCreatorHandler,
} from "./admin.handler";

// eslint-disable-next-line new-cap
const router = Router();

// 全ての管理者エンドポイントは認証が必要
router.use(verifyAuth);

router.post("/creators", createCreatorHandler);
router.put("/creators/:id", updateCreatorHandler);
router.delete("/creators/:id", deleteCreatorHandler);

export default router;
