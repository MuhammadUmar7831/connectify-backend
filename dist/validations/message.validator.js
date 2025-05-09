"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMimeType = exports.sendMessageSchema = void 0;
const yup = __importStar(require("yup"));
exports.sendMessageSchema = yup.object({
    chatId: yup.string().required('User Id is required'),
    text: yup.string().required('Text is required (in case of audio type send empty string)'),
    type: yup.string().oneOf(["text", "image", "video", "audio"]).required('Type is required'),
    repliedTo: yup.string().nullable().optional(),
}).noUnknown(true, "Unexpected keys are not allowed");
const isValidMimeType = (expectedType, mime) => {
    const mimeMap = {
        image: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
        video: ["video/mp4", "video/webm", "video/ogg"],
        audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"],
    };
    return mimeMap[expectedType]?.includes(mime) ?? false;
};
exports.isValidMimeType = isValidMimeType;
