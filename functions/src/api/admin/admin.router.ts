import {Router} from "express";
import {
    createCreatorHandler,
    updateCreatorHandler,
    deleteCreatorHandler,
} from "./admin.handler";

// eslint-disable-next-line new-cap
const router = Router();

router.post("/creators", createCreatorHandler);
router.put("/creators/:id", updateCreatorHandler);
router.delete("/creators/:id", deleteCreatorHandler);

export default router;
