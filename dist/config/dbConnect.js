"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const config_1 = __importDefault(require("./config"));
const dbConnect = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log(colors_1.default.blue(`🚀 The Mongodb database is connected successfully`));
    }
    catch (error) {
        console.log(colors_1.default.red(`🤢 Failed to connect Database`));
    }
};
exports.dbConnect = dbConnect;
//# sourceMappingURL=dbConnect.js.map