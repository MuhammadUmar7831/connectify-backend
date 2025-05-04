import { Request, Response } from "express";
import { Chat, User } from "../models";
import { createChatSchema } from "../validations/chat.validator";
import { errorResponse, response } from "../utils";
import mongoose from "mongoose";

export async function createChat(req: Request, res: Response) {
  await createChatSchema.validate(req.body)

  if (req.body.type == "personal" && req.body.members.length > 1) {
    return errorResponse(400, "Personal chat can only have 2 member you and the member in th body")
  }

  const members = Array.from(new Set([...req.body.members, req.user._id]));
  if (members.length == 0) {
    return errorResponse(400, "At least one member is required")
  }

  const me = await User.findById(req.user._id);
  req.body.members.forEach((member: string) => {
    if (!me?.friends.includes(new mongoose.Types.ObjectId(member))) {
      return errorResponse(400, "You can only create chat with your friends")
    }
  })

  if (req.body.type == "personal") {
    const existingChat = await Chat.findOne({
      type: "personal",
      members: { $all: members }
    });

    if (existingChat) {
      return errorResponse(400, "You already have a personal chat with this user");
    }
  }

  const chat = await Chat.create({ ...req.body, members })

  return res.status(200).send(response(chat, "Chat created"))
}