import {Router} from "express";
import {createCreatorFromYouTubeHandler, syncAllTagIntoAlgoliaHandler} from "./admin.handler";

// eslint-disable-next-line new-cap
const router = Router();

// YouTubeチャンネルからクリエイター作成
router.post("/creators/youtube", createCreatorFromYouTubeHandler);

// 全タグをAlgoliaに同期
router.post("/tags/sync-algolia", syncAllTagIntoAlgoliaHandler);

export default router;
