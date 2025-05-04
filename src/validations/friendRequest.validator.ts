import * as yup from 'yup';

export const sendRequestSchema = yup.object().shape({
  receiverUserId: yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Receiver User ID: Invalid MongoDB ObjectId")
    .required("Receiver User ID is required"),
});

export const updateStatusSchema = yup.object().shape({
  requestId: yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")
    .required("Request ID is required"),
  status: yup.string()
    .oneOf(["accept", "reject"], "Status must be 'accept' or 'reject'")
    .required("Status is required"),
});

