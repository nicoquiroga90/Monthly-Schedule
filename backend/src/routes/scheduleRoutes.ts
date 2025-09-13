import { Router } from "express";
import { generateSchedule } from "../controllers/scheduleController.js";

const router = Router();

router.post("/generate", generateSchedule);

export default router;
