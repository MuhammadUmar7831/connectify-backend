import { NextFunction, Request, Response } from "express";
import { isValidMimeType, sendMessageSchema } from "../validations/message.validator";
import { errorResponse, response, uploadAudio, uploadImage, uploadVideo } from "../utils";
import { Chat, Message } from "../models";
import { Receipt } from "../types";
import mongoose from "mongoose";
import { activeUsers } from "../socket/index";
import { io } from "../socket";

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  await sendMessageSchema.validate(req.body);

  const { type, chatId, text, repliedTo } = req.body;
  const attachment = req.file;

  if (type !== "text" && !attachment) {
    return errorResponse(400, "Attachment is required for non-text messages");
  }

  let link: string | undefined = undefined;
  if (type !== "text" && attachment) {
    if (!isValidMimeType(type, attachment.mimetype)) {
      return errorResponse(400, 'Uploaded file mimetype not match with the type')
    }

    if (type == "video") {
      link = await uploadVideo(attachment)
    } else if (type == "image") {
      link = await uploadImage(attachment);
    } else {
      link = await uploadAudio(attachment)
    }
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return errorResponse(404, "Chat not found");
  }
  if (!chat.members.includes(new mongoose.Types.ObjectId(req.user._id))) {
    return errorResponse(401, "You are not member of this chat")
  }

  if (repliedTo) {
    const reply = await Message.findById(repliedTo);
    if (!reply) {
      return errorResponse(404, "The message to which it is reply not found");
    }
    if (reply.chatId != chatId) {
      return errorResponse(400, "The message to which this is reply does not belong this chat");
    }
  }

  const members = chat.members;

  const onlineUserIds = Object.values(activeUsers);
  const roomMembers = io.sockets.adapter.rooms.get(chatId);


  const receipt: Receipt[] = members
    .filter(member => member.toString() !== req.user._id.toString())
    .map(member => {
      const userId = member.toString();
      let status: "sent" | 'seen' | 'received' = 'sent';

      if (roomMembers && roomMembers?.has(userId)) {
        status = 'seen'
      } else if (onlineUserIds && onlineUserIds.includes(userId)) {
        status = 'received'
      }

      return {
        userId,
        status
      }
    });

  // Transaction start
  const session = await mongoose.startSession();

  try {

    await session.withTransaction(async () => {
      const message = await Message.create({
        chatId,
        sender: req.user._id,
        text,
        type,
        link,
        repliedTo,
        receipt
      });

      await Chat.updateOne(
        { _id: chatId },
        { $push: { messages: message._id } }
      );

      res.status(200).send(response(message, "Message sent"))

    })
  } catch (e) {
    next(e)
  } finally {
    session.endSession();
  }
  // Transaction end

  return;
}

export async function getAllMessages(req: Request, res: Response) {
  const { chatId } = req.params

  const chat = await Chat.findById(chatId)

  if (!chat) {
    return errorResponse(404, "Chat not found")
  }
  if (!chat.members.includes(new mongoose.Types.ObjectId(req.user._id))) {
    return errorResponse(401, "You are not member of this chat")
  }

  const messages = await Message.find({ chatId })
    .populate("sender", "_id name profilePicture")
    .populate("repliedTo", "_id sender text link")

  return res.status(200).send(response(messages, "Messages retrieved"))
}