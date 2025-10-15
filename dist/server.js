"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const dbConnect_1 = require("./config/dbConnect");
// connect to database
(0, dbConnect_1.dbConnect)();
const port = typeof config_1.default.port === "number" ? config_1.default.port : Number(config_1.default.port);
app_1.default.listen(port, () => {
    console.log(colors_1.default.yellow(`Qube Server is running on port http://${config_1.default.ip_address}:${port}`));
});
//# sourceMappingURL=server.js.map