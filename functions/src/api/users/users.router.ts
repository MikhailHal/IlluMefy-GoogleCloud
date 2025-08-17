import {Router} from "express";
import {verifyAuth} from "../../middleware/auth";
import {
    getUserFavoritesHandler,
    addFavoriteHandler,
    removeFavoriteHandler,
    checkAlradyFavoriteCreator,
    addSearchHistoryHandler,
    getUserEditHistoryHandler,
} from "./users.handler";

// eslint-disable-next-line new-cap
const router = Router();

// 全てのユーザー関連エンドポイントは認証が必要
router.use(verifyAuth);

router.get("/favorites", getUserFavoritesHandler);
router.post("/favorites/:creatorId", addFavoriteHandler);
router.delete("/favorites/:creatorId", removeFavoriteHandler);
router.get("/favorites/:creatorId/check", checkAlradyFavoriteCreator);
router.post("/search-history", addSearchHistoryHandler);
router.get("/edit-history", getUserEditHistoryHandler);

export default router;
