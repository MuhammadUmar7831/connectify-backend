"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAudio = exports.uploadVideo = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const constants_1 = require("../config/constants");
const uploadImage = (file) => {
    return upload(file, "image");
};
exports.uploadImage = uploadImage;
const uploadVideo = (file) => {
    return upload(file, "video");
};
exports.uploadVideo = uploadVideo;
const uploadAudio = (file) => {
    return upload(file, "video");
};
exports.uploadAudio = uploadAudio;
/**
 * Uploads an image to Cloudinary in the "connectify" folder.
 * @param {Express.Multer.File} file - The image file object.
 * @returns {Promise<string>} - The URL of the uploaded image.
 * @throws {Error} - Throws an error if upload fails.
 */
const upload = (file, resource_type) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided"));
        }
        const stream = cloudinary_1.default.uploader.upload_stream({ resource_type, folder: constants_1.CLOUDINARY_FOLDER }, (error, result) => {
            if (error) {
                return reject(new Error("Image upload failed: " + error.message));
            }
            else {
                resolve(result?.secure_url);
            }
        });
        stream.end(file.buffer);
    });
};
