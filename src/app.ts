import express from "express";
import cors from "cors";
import {
  chatRouter,
  friendRequestRouter,
  groupRouter,
  messageRouter,
  userRouter,
} from "./routes";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ message: "Connectify Backend" });
});

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/group", groupRouter);
app.use("/message", messageRouter);
app.use("/friend-request", friendRequestRouter);

export default app;
