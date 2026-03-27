import { Router } from "express";
import { voteController } from "../controllers/vote-controller.js";

const router = Router();

router.post("/", voteController.submitVote);
// Llamado por el jurado al entregar el tarjeton fisico
router.post("/presencial", voteController.markPresencial);
router.get("/summary", voteController.getSummary);

export { router as voteRoutes };
