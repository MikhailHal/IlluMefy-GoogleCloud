import {Router} from "express";
import {healthHandler} from "./health.handler";

// ESLintが誤検知するため無効化
// eslint-disable-next-line new-cap
const router = Router();
router.get("/", healthHandler);
export default router;
