import { Router } from "express";
import { tryCatch } from "../utils";
import { getFriendRequests, sendFriendRequest, updateStatus } from "../controllers";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

// all routes goes here
router.get("/", authenticate, tryCatch(getFriendRequests));
router.post("/send", authenticate, tryCatch(sendFriendRequest));
router.put("/update-status", authenticate, tryCatch(updateStatus));

export default router;
