"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const morgan_1 = __importDefault(require("morgan"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.status(200).send({ message: "Connectify Backend" });
});
app.use("/user", routes_1.userRouter);
app.use("/chat", routes_1.chatRouter);
app.use("/group", routes_1.groupRouter);
app.use("/message", routes_1.messageRouter);
app.use("/friend-request", routes_1.friendRequestRouter);
// All the errors from the application are handled here
app.use(utils_1.errorResponseHandler);
exports.default = app;
