import { Request, Response } from "express";
import { FriendRequest, User } from "../models";
import { IFriendRequest } from "../types";
import { errorResponse, response } from "../utils";
import { sendRequestSchema, updateStatusSchema } from "../validations";

export async function getFriendRequests(req: Request, res: Response) {
  const userId = req.user._id
  const friendRequests = await FriendRequest.find({
    $or: [
      { sender: userId },
      { receiver: userId }
    ]
  })
    .populate<IFriendRequest>({
      path: 'sender',
      select: 'name profilePicture description',
    })
    .populate<IFriendRequest>({
      path: 'receiver',
      select: 'name profilePicture description',
    })

  const filteredData = friendRequests.map(request => {
    const isSenderMe = request.sender._id.toString() === userId.toString();
    const otherUser = isSenderMe ? request.receiver : request.sender;

    return {
      _id: request._id,
      name: otherUser.name,
      profilePicture: otherUser.profilePicture,
      description: otherUser.description,
      status: isSenderMe ? "received" : "sent"
    };
  });

  return res.status(200).send(response(filteredData, "Friend requests retrieved"));
}

export async function sendFriendRequest(req: Request, res: Response) {
  await sendRequestSchema.validate(req.body);
  const { receiverUserId } = req.body;
  const senderUserId = req.user._id;

  const request = await FriendRequest.findOne({ sender: senderUserId, receiver: receiverUserId });
  if (request) {
    return errorResponse(400, "Friend request already sent");
  }

  const user = await User.findById(senderUserId);
  if (user && user.friends.includes(receiverUserId)) {
    return errorResponse(400, "You are already friends");
  }

  await FriendRequest.create({ sender: senderUserId, receiver: receiverUserId });
  return res.status(200).send(response("request id", "Friend request sent"));
}

export async function updateStatus(req: Request, res: Response) {
  await updateStatusSchema.validate(req.body);
  const { requestId, status } = req.body;

  const request = await FriendRequest.findById(requestId);
  if (!request) {
    return errorResponse(404, "Friend request not found");
  }

  if (status === "accept") {
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });
  }

  await FriendRequest.findByIdAndDelete(requestId);
  return res.status(200).send(response("request id", "Friend request status updated"));
}