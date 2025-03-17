# Connectify-Server
This repository hosts the server (back-end) of Connectify: an open-source chatting platform for individuals.

# DB Scehma
## Users
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String", // Unique, Indexed
  "about": "String",
  "profilePicture": "String",
  "friends": ["ObjectId"],
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

## FriendRequests
```json
{
  "_id": "ObjectId",
  "sender": "ObjectId", // Reference to `users`
  "receiver": "ObjectId", // Reference to `users`
  "status": { "type": "String", "enum": ["pending", "accepted", "rejected"], "default": "pending" },
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

## Chat
```json
{
  "_id": "ObjectId",
  "type": { "type": "String", "enum": ["private", "group"], "required": true },
  "members": ["ObjectId"], // Array of User IDs
  "messages": ["ObjectId"], // Reference to `messages`
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

## Message
```json
{
  "_id": "ObjectId",
  "chatId": "ObjectId", // Reference to `chats`
  "sender": "ObjectId", // Reference to `users`
  "text": "String",
  "type": { "type": "String", "enum": ["text", "image", "video", "audio", "link"], "required": true },
  "link": "String", // For images, videos, and audio messages
  "repliedTo": "ObjectId", // Reference to another `message` for replies can be null
   receipt: [
    {
      userId: ObjectId, // Reference to `users`
      sent: Boolean,
      received: Boolean,
      seen: Boolean
    }
  ],
  "createdAt": { "type": "Date", "default": "Date.now" },
  "deleted": { "type": "Boolean", "default": false } // Soft delete for messages | Not required, it will only appear if explicitly set
}
```

## Group
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "chatId": "ObjectId", // Reference to `chats`
  "admins": ["ObjectId"], // Array of User IDs
  "picture": "String",
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

