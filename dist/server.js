"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = __importDefault(require("./socket"));
const db_1 = __importDefault(require("./config/db"));
const constants_1 = require("./config/constants");
(0, db_1.default)();
socket_1.default.listen(constants_1.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${constants_1.PORT}`);
});
