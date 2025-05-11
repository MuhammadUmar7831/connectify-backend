import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { signinBodySchema, signupBodySchema } from "../validations";
import { Chat, Group, Message, User } from "../models";
import { errorResponse, generateToken, response, uploadImage } from "../utils";
import { SALT_ROUNDS } from "../config/constants";
import mongoose from "mongoose";

export async function signin(req: Request, res: Response) {
  await signinBodySchema.validate(req.body, { abortEarly: true });

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(404, "Email not registered");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return errorResponse(401, "Invalid credentials");
  }

  const tokenPayload = { name: user.name, email: user.email, _id: user._id, profilePicture: user.profilePicture };
  const accessToken = generateToken(tokenPayload);

  return res.status(200).send(response({ user: tokenPayload, token: accessToken }, "Signin successful"));
}

export async function signup(req: Request, res: Response) {
  await signupBodySchema.validate(req.body, { abortEarly: true });

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return errorResponse(400, "Email already registered");
  }

  const createPayload = req.body;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  createPayload.password = hashedPassword;

  const profilePicture = req.file;
  if (profilePicture) {
    const profilePictureUrl = await uploadImage(profilePicture);
    createPayload.profilePicture = profilePictureUrl;
  }

  const newUser = await User.create(createPayload);
  delete createPayload["password"]; // deleting password for security

  const tokenPayload = { name: createPayload.name, email, _id: newUser._id, profilePicture: createPayload.profilePicture };
  const accessToken = generateToken(tokenPayload);
  createPayload.accessToken = accessToken;

  res.status(201).send(response({ user: tokenPayload, token: createPayload }, "Signup successful"));
}

export async function authenticateUser(req: Request, res: Response) {
  const user = await User.findById(req.user._id);
  if (!user) {
    return errorResponse(404, "User not found");
  }

  const { _id, name, email, profilePicture } = user;
  const data = { _id, name, email, profilePicture };

  return res.status(200).send(response(data, "User retrieved"))
}

export async function getUserInfo(req: Request, res: Response) {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const myId = new mongoose.Types.ObjectId(req.user._id)

  const user = await User.findById(userId)
    .select("_id name about createdAt profilePicture friends")
    .populate("friends", "_id name profilePicture about");

  if (!user) {
    return errorResponse(404, 'User not found')
  }

  const commonChats = await Chat.find({
    members: { $all: [userId, myId] },
  })

  const commonGroups = await Group.find({
    chatId: { $in: commonChats.map(chat => chat._id) }
  }).populate({
    path: 'chatId',
    populate: {
      path: 'members',
      select: '_id name',
    },
    select: '_id members type'
  })
    .select("_id name picture chatId");

  const personalChat = commonChats.find((chat) => chat.type == 'personal')
  const isFriend = user.friends.includes(myId)

  const mediaMessages = await Message.find({
    _id: { $in: personalChat?.messages || [] },
    type: { $nin: ['text', 'audio'] }
  }).select("_id link type")

  return res.status(200).send(response({ user, commonGroups, chatId: personalChat?._id, mediaMessages, isFriend }, "User info retrieved"))
}

export async function getAllUsers(req: Request, res: Response) {
  const userId = new mongoose.Types.ObjectId(req.user._id)
  const users = await User.find({
    _id: { $ne: userId }
  })
    .select("_id name profilePicture about")

  return res.status(200).send(response(users, "Users retrieved"))
}