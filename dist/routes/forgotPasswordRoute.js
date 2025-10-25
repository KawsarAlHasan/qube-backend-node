"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const forgotPassword_1 = require("../controllers/forgotPassword");
const router = express_1.default.Router();
router.post("/send-reset-code", forgotPassword_1.sendForgotPasswordOtp);
router.post("/check-reset-code", forgotPassword_1.checkForgotPasswordOtp);
router.post("/set-new-password", forgotPassword_1.newPasswordSet);
exports.ForgotRoutes = router;
//# sourceMappingURL=forgotPasswordRoute.js.map