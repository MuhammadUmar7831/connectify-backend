import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";
import type { StringValue } from "ms";

export function generateToken(
  payload: JwtPayload,
  expiresIn: number | StringValue | undefined = "1h"
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
