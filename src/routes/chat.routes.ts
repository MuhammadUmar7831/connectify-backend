import { createGroupChat, createPersonalChat, getAllChats } from "../controllers";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { tryCatch } from "../utils";
import upload from "../middlewares/upload";

const router = Router();

// all routes goes here
router.post("/personal", authenticate, tryCatch(createPersonalChat));
router.post("/group", authenticate, upload.single("picture"), tryCatch(createGroupChat));
router.get("/", authenticate, tryCatch(getAllChats));

export default router;
