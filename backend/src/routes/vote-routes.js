import { Router } from "express";
import { voteController } from "../controllers/vote-controller.js";

const router = Router();

router.post("/", voteController.submitVote);
router.get("/summary", voteController.getSummary);
router.get("/records", voteController.getRecords);

export { router as voteRoutes };
