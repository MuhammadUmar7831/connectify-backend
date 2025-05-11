"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = signin;
exports.signup = signup;
exports.authenticateUser = authenticateUser;
exports.getUserInfo = getUserInfo;
exports.getAllUsers = getAllUsers;
exports.getActiveUsers = getActiveUsers;
const bcrypt_1 = __importDefault(require("bcrypt"));
const validations_1 = require("../validations");
const models_1 = require("../models");
const utils_1 = require("../utils");
const constants_1 = require("../config/constants");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../socket/index");
async function signin(req, res) {
    await validations_1.signinBodySchema.validate(req.body, { abortEarly: true });
    const { email, password } = req.body;
    const user = await models_1.User.findOne({ email });
    if (!user) {
        return (0, utils_1.errorResponse)(404, "Email not registered");
    }
    const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return (0, utils_1.errorResponse)(401, "Invalid credentials");
    }
    const tokenPayload = { name: user.name, email: user.email, _id: user._id, profilePicture: user.profilePicture };
    const accessToken = (0, utils_1.generateToken)(tokenPayload);
    return res.status(200).send((0, utils_1.response)({ user: tokenPayload, token: accessToken }, "Signin successful"));
}
async function signup(req, res) {
    await validations_1.signupBodySchema.validate(req.body, { abortEarly: true });
    const { email, password } = req.body;
    const user = await models_1.User.findOne({ email });
    if (user) {
        return (0, utils_1.errorResponse)(400, "Email already registered");
    }
    const createPayload = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, constants_1.SALT_ROUNDS);
    createPayload.password = hashedPassword;
    const profilePicture = req.file;
    if (profilePicture) {
        const profilePictureUrl = await (0, utils_1.uploadImage)(profilePicture);
        createPayload.profilePicture = profilePictureUrl;
    }
    const newUser = await models_1.User.create(createPayload);
    delete createPayload["password"]; // deleting password for security
    const tokenPayload = { name: createPayload.name, email, _id: newUser._id, profilePicture: createPayload.profilePicture };
    const accessToken = (0, utils_1.generateToken)(tokenPayload);
    createPayload.accessToken = accessToken;
    res.status(201).send((0, utils_1.response)({ user: tokenPayload, token: createPayload }, "Signup successful"));
}
async function authenticateUser(req, res) {
    const user = await models_1.User.findById(req.user._id);
    if (!user) {
        return (0, utils_1.errorResponse)(404, "User not found");
    }
    const { _id, name, email, profilePicture } = user;
    const data = { _id, name, email, profilePicture };
    return res.status(200).send((0, utils_1.response)(data, "User retrieved"));
}
async function getUserInfo(req, res) {
    const userId = new mongoose_1.default.Types.ObjectId(req.params.userId);
    const myId = new mongoose_1.default.Types.ObjectId(req.user._id);
    const user = await models_1.User.findById(userId)
        .select("_id name about createdAt profilePicture friends")
        .populate("friends", "_id name profilePicture about");
    if (!user) {
        return (0, utils_1.errorResponse)(404, 'User not found');
    }
    const commonChats = await models_1.Chat.find({
        members: { $all: [userId, myId] },
    });
    const commonGroups = await models_1.Group.find({
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
    const personalChat = commonChats.find((chat) => chat.type == 'personal');
    const isFriend = user.friends.includes(myId);
    const mediaMessages = await models_1.Message.find({
        _id: { $in: personalChat?.messages || [] },
        type: { $nin: ['text', 'audio'] }
    }).select("_id link type");
    return res.status(200).send((0, utils_1.response)({ user, commonGroups, chatId: personalChat?._id, mediaMessages, isFriend }, "User info retrieved"));
}
async function getAllUsers(req, res) {
    const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
    const users = await models_1.User.find({
        _id: { $ne: userId }
    })
        .select("_id name profilePicture about");
    return res.status(200).send((0, utils_1.response)(users, "Users retrieved"));
}
async function getActiveUsers(req, res) {
    const activeUserIds = Array.from(index_1.activeUsers.values());
    return res.status(200).send((0, utils_1.response)(activeUserIds, "Users retrieved"));
}
