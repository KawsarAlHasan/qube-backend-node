"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyUserToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../config/config"));
const userModel_1 = require("../models/userModel");
dotenv_1.default.config();
async function verifyUserToken(req, res, next) {
    var _a, _b, _c;
    try {
        const token = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")) === null || _c === void 0 ? void 0 : _c[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not logged in",
            });
        }
        jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret, async (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: "Forbidden access",
                });
            }
            const _id = decoded.id;
            const user = await userModel_1.User.findById(_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found. Please login again",
                });
            }
            req.decodedUser = user;
            next();
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: "Invalid Token",
            error: error.message,
        });
    }
}
//# sourceMappingURL=verifyUserToken.js.map