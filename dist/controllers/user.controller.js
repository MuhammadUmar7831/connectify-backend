"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = signin;
exports.signup = signup;
const bcrypt_1 = __importDefault(require("bcrypt"));
const validations_1 = require("../validations");
const models_1 = require("../models");
const utils_1 = require("../utils");
const constants_1 = require("../config/constants");
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
    return res.status(200).send((0, utils_1.response)(accessToken, "Signin successful"));
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
    res.status(201).send((0, utils_1.response)(createPayload, "Signup successful"));
}
