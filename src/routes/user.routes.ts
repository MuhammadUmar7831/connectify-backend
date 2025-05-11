import { Router } from "express";
import { signin, authenticateUser, signup, getUserInfo, getAllUsers } from "../controllers";
import { tryCatch } from "../utils";
import upload from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

// all routes goes here
router.get("/auth", authenticate, tryCatch(authenticateUser));
router.post("/signin", tryCatch(signin));
router.post("/signup", upload.single("profilePicture"), tryCatch(signup));
router.get("/all", authenticate, tryCatch(getAllUsers));
router.get("/:userId", authenticate, tryCatch(getUserInfo));

export default router;
