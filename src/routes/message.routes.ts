import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { tryCatch } from "../utils";
import { getAllMessages, sendMessage } from "../controllers/message.controller";
import upload from "../middlewares/upload";

const router = Router();

// all routes goes here
router.post('/', authenticate , upload.single("attachment"), tryCatch(sendMessage))
router.get('/:chatId', authenticate , tryCatch(getAllMessages))

export default router;
