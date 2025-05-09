"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
exports.response = response;
exports.tryCatch = tryCatch;
exports.errorResponseHandler = errorResponseHandler;
// Just to standardize the response
function response(data, message) {
    return {
        success: true,
        data,
        message,
    };
}
const errorResponse = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    throw error;
};
exports.errorResponse = errorResponse;
function tryCatch(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
function errorResponseHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    // Default error handler
    const message = err.message || "Internal Server Error";
    res.status(status).json({ success: false, message });
}
