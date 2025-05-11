import { Request, Response } from "express";
import { Chat, Group, Message, User } from "../models";
import { createGroupChatSchema, createPersonalChatSchema } from "../validations/chat.validator";
import { errorResponse, response, uploadImage } from "../utils";
import mongoose from "mongoose";
import { pipeline } from "stream";

export async function createPersonalChat(req: Request, res: Response) {
  await createPersonalChatSchema.validate(req.body)
  const { userId } = req.body;

  const existingChat = await Chat.findOne({
    type: "personal",
    members: { $all: [req.user._id, userId], $size: 2 }
  });

  if (existingChat) {
    return errorResponse(400, "You already have a personal chat with this user");
  }

  const chat = await Chat.create({ type: "personal", members: [req.user._id, userId] })

  return res.status(200).send(response(chat, "Chat created"))
}

export async function createGroupChat(req: Request, res: Response) {
  await createGroupChatSchema.validate(req.body)
  const pictureFile = req.file

  const payload = req.body;

  const members = Array.from(new Set([...req.body.members, req.user._id]));
  if (members.length == 0) {
    return errorResponse(400, "At least one member is required")
  }

  if (pictureFile) {
    const profilePictureUrl = await uploadImage(pictureFile);
    payload.picture = profilePictureUrl;
  } else {
    return errorResponse(400, "Group picture is required");
  }

  const chat = await Chat.create({ type: "group", members })
  const group = await Group.create({
    admins: [req.user._id],
    chatId: chat._id,
    description: payload.description,
    name: payload.name,
    picture: payload.picture
  })

  return res.status(200).send(response({ chat, group }, "Chat created"))
}

export async function getAllChats(req: Request, res: Response) {
  const userId = new mongoose.Types.ObjectId(req.user._id)
  const chats = await Chat.aggregate([
    {
      $match: {
        members: { $in: [userId] }
      }
    },
    {
      $lookup: {
        from: "messages",
        foreignField: "_id",
        localField: "messages",
        as: "messages",
      }
    },
    {
      $set: {
        messages: {
          $sortArray: {
            input: "$messages",
            sortBy: { createdAt: -1 }
          }
        }
      }
    },
    {
      $addFields: {
        lastMessage: { $first: "$messages" }
      }
    },
    {
      $lookup: {
        from: "groups",
        localField: "_id",
        foreignField: "chatId",
        as: "group"
      }
    },
    {
      $addFields: {
        group: { $first: "$group" } // to flatten group as there will only be one
      }
    },
    {
      $addFields: {
        otherUser: {
          $cond: [
            { $not: ["$group"] },
            {
              $first: {
                $filter: {
                  input: "$members",
                  as: "member",
                  cond: { $ne: ["$$member", userId] }
                }
              }
            },
            "$$REMOVE"
          ]
        }
      }
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "otherUser",
        as: "otherUser"
      }
    },
    {
      $addFields: {
        otherUser: { $first: "$otherUser" }
      }
    },
    {
      $addFields: {
        name: {
          $cond: [
            { $ifNull: ["$group", false] },
            "$group.name",
            "$otherUser.name"
          ]
        },
        avatar: {
          $cond: [
            { $ifNull: ["$group", false] },
            "$group.picture",
            "$otherUser.profilePicture"
          ]
        },
        unseenMessagesCount: {
          $size: {
            $filter: {
              input: "$messages.receipt",
              as: "receipt",
              cond: {
                $and: [
                  { $eq: ["$$receipt.userId", userId] },
                  { $ne: ["$$receipt.status", "seen"] }
                ]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        group: 0,
        otherUser: 0,
        members: 0,
        messages: 0
      }
    }
  ])

  return res.status(200).send(response(chats, "Chats retrieved"))
}
