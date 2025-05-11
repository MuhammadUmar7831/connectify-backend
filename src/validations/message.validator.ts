import * as yup from "yup";

export const sendMessageSchema = yup.object({
  chatId: yup.string().required('User Id is required'),
  text: yup.string().required('Text is required (in case of audio type send empty string)'),
  type: yup.string().oneOf(["text", "image", "video", "audio"]).required('Type is required'),
  repliedTo: yup.string().nullable().optional(),
}).noUnknown(true, "Unexpected keys are not allowed");

export const isValidMimeType = (expectedType: string, mime: string): boolean => {
  const mimeMap: Record<string, string[]> = {
    image: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
    video: ["video/mp4", "video/webm", "video/ogg"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/webm"],
  };

  return mimeMap[expectedType]?.includes(mime) ?? false;
};
