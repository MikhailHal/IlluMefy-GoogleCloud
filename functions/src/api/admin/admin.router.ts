import {Router} from "express";
import {createCreatorFromYouTubeHandler} from "./admin.handler";

// eslint-disable-next-line new-cap
const router = Router();

// YouTubeチャンネルからクリエイター作成
router.post("/creators/youtube", createCreatorFromYouTubeHandler);

export default router;
