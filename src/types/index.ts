import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId | string;
  name: string;
  profilePicture: string;
  description: string;
}

export interface IFriendRequest {
  _id: Types.ObjectId | string;
  sender: IUser;
  receiver: IUser;
}

export interface Receipt {
  userId: string;
  status: "sent" | "received" | "seen"
}