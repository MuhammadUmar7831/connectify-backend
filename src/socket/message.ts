import { Message } from "../models";

export async function updateUnseenMessages({
  chatId,
  userId
}: {
  chatId: string;
  userId: string;
}) {
  try {
    await Message.updateMany(
      {
        chatId,
        "receipt.userId": userId,
        "receipt.status": { $ne: "seen" },
      },
      {
        $set: { "receipt.$[elem].status": "seen" },
      },
      {
        arrayFilters: [{ "elem.userId": userId, "elem.status": { $ne: "seen" } }],
      }
    );

    return true;
  } catch (error) {
    console.error("❌ Failed to update unseen messages", error);
    return false
  }
}

export async function updateNotReceivedMessages({
  userId
}: {
  userId: string;
}) {
  try {
    await Message.updateMany(
      {
        "receipt": {
          $elemMatch: {
            userId,
            status: "sent",
          },
        },
      },
      {
        $set: {
          "receipt.$[elem].status": "received",
        },
      },
      {
        arrayFilters: [
          {
            "elem.userId": userId,
            "elem.status": "sent", // Only update if status is still "sent"
          },
        ],
      }
    );

    return true;
  } catch (error) {
    console.error("❌ Failed to update not received messages", error);
    return false;
  }
}