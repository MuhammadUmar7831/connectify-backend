import * as yup from "yup";

export const createPersonalChatSchema = yup.object({
  userId: yup.number().required('User Id is required'),
}).noUnknown(true, "Unexpected keys are not allowed");

export const createGroupChatSchema = yup.object({
  name: yup.string().required('Group name is required'),
  description: yup.string().required('Group description is required'),
  'members[]': yup
    .array()
    .of(yup.string().required("Member ID must be a string"))
    .min(1, "At least one member is required")
    .required(),
}).noUnknown(true, "Unexpected keys are not allowed");