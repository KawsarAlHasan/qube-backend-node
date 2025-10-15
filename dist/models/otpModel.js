"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    otp_expired: {
        type: Date,
        required: true,
        index: { expires: "7m" },
    },
    type: {
        type: String,
        enum: ["emailVerification", "phoneVerification", "resetPassword"],
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Otp = (0, mongoose_1.model)("Otp", OtpSchema);
//# sourceMappingURL=otpModel.js.map