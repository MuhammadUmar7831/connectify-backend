import { Router } from "express";
import { signin, signup } from "../controllers";
import { tryCatch } from "../utils";
import upload from "../middlewares/upload";

const router = Router();

// all routes goes here
router.post("/signin", tryCatch(signin));
router.post("/signup", upload.single("profilePicture"), tryCatch(signup));

export default router;
