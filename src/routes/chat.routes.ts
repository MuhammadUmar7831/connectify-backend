import { createChat } from "../controllers";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { tryCatch } from "../utils";

const router = Router();

// all routes goes here
router.post("/create", authenticate, tryCatch(createChat));

export default router;
