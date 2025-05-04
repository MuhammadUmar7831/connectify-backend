import { NextFunction, Request, Response } from "express";
import { errorResponse, tryCatch } from "../utils";
import jwt from "jsonwebtoken"

export const authenticate = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return errorResponse(401, "Unauthorized");
  }
  const user = jwt.verify(token, process.env.JWT_SECRET as string) as User
  req.user = user
  next();
})