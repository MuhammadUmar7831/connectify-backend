"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendRequests = getFriendRequests;
exports.sendFriendRequest = sendFriendRequest;
exports.updateStatus = updateStatus;
const models_1 = require("../models");
const utils_1 = require("../utils");
const validations_1 = require("../validations");
async function getFriendRequests(req, res) {
    const userId = req.user._id;
    const friendRequests = await models_1.FriendRequest.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    })
        .populate({
        path: 'sender',
        select: 'name profilePicture description',
    })
        .populate({
        path: 'receiver',
        select: 'name profilePicture description',
    });
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
    return res.status(200).send((0, utils_1.response)(filteredData, "Friend requests retrieved"));
}
async function sendFriendRequest(req, res) {
    await validations_1.sendRequestSchema.validate(req.body);
    const { receiverUserId } = req.body;
    const senderUserId = req.user._id;
    const request = await models_1.FriendRequest.findOne({ sender: senderUserId, receiver: receiverUserId });
    if (request) {
        return (0, utils_1.errorResponse)(400, "Friend request already sent");
    }
    const user = await models_1.User.findById(senderUserId);
    if (user && user.friends.includes(receiverUserId)) {
        return (0, utils_1.errorResponse)(400, "You are already friends");
    }
    await models_1.FriendRequest.create({ sender: senderUserId, receiver: receiverUserId });
    return res.status(200).send((0, utils_1.response)("request id", "Friend request sent"));
}
async function updateStatus(req, res) {
    await validations_1.updateStatusSchema.validate(req.body);
    const { requestId, status } = req.body;
    const request = await models_1.FriendRequest.findById(requestId);
    if (!request) {
        return (0, utils_1.errorResponse)(404, "Friend request not found");
    }
    if (status === "accept") {
        await models_1.User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
        await models_1.User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });
    }
    await models_1.FriendRequest.findByIdAndDelete(requestId);
    return res.status(200).send((0, utils_1.response)("request id", "Friend request status updated"));
}
