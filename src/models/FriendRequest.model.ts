import mongoose from "mongoose";

// if there is friend request, it means the users are not friends 
const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
