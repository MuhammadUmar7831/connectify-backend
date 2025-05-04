import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { signinBodySchema, signupBodySchema } from "../validations";
import { User } from "../models";
import { errorResponse, generateToken, response, uploadImage } from "../utils";
import { SALT_ROUNDS } from "../config/constants";

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

  return res.status(200).send(response(accessToken, "Signin successful"));
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

  res.status(201).send(response(createPayload, "Signup successful"));
}
