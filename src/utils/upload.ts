import cloudinary from "../config/cloudinary";
import { CLOUDINARY_FOLDER } from "../config/constants";

/**
 * Uploads an image to Cloudinary in the "connectify" folder.
 * @param {Express.Multer.File} file - The image file object.
 * @returns {Promise<string>} - The URL of the uploaded image.
 * @throws {Error} - Throws an error if upload fails.
 */
export const uploadImage = (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: CLOUDINARY_FOLDER },
      (error, result) => {
        if (error) {
          return reject(new Error("Image upload failed: " + error.message));
        } else {
          resolve(result?.secure_url);
        }
      }
    );

    stream.end(file.buffer);
  });
};
