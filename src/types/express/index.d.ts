import { Request } from "express";

declare global {

  interface User {
    name: string;
    email: string;
    _id: string;
    profilePicture: string;
    iat: number;
    exp: number;
  }

  namespace Express {
    interface Request {
      user: User;
    }
  }
}

