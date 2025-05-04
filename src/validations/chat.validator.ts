import * as yup from "yup";

export const createChatSchema = yup.object({
  type: yup.string().oneOf(["personal", "group"]).required(),
  members: yup
    .array()
    .of(yup.string().required("Member ID must be a string"))
    .min(1, "At least one member is required")
    .required(),
}).noUnknown(true, "Unexpected keys are not allowed");