"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordSet = exports.checkForgotPasswordOtp = exports.sendForgotPasswordOtp = void 0;
const userModel_1 = require("../models/userModel");
const otpModel_1 = require("../models/otpModel");
const emailerService_1 = require("../middleware/emailerService");
// send forgot password otp on email
const sendForgotPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            });
        }
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpDoc = await otpModel_1.Otp.findOne({ email });
        if (otpDoc) {
            otpDoc.otp = otp;
            otpDoc.type = "resetPassword";
            otpDoc.otp_expired = new Date(Date.now() + 7 * 60 * 60 * 1000);
            await otpDoc.save();
        }
        else {
            await otpModel_1.Otp.create({
                email,
                otp,
                type: "resetPassword",
                otp_expired: new Date(Date.now() + 7 * 60 * 60 * 1000),
            });
        }
        await (0, emailerService_1.sendResetEmail)(email, otp.toString());
        res.status(200).json({
            success: true,
            message: "Otp sent successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.sendForgotPasswordOtp = sendForgotPasswordOtp;
// check forgot password otp
const checkForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and otp",
            });
        }
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const otpDoc = await otpModel_1.Otp.findOne({ email });
        if (!otpDoc) {
            return res.status(404).json({
                success: false,
                message: "Otp not found",
            });
        }
        if (otpDoc.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp",
            });
        }
        if (otpDoc.type !== "resetPassword") {
            return res.status(400).json({
                success: false,
                message: "Invalid otp type",
            });
        }
        if (otpDoc.otp_expired < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Otp expired",
            });
        }
        if (otpDoc.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp",
            });
        }
        otpDoc.isVerified = true;
        await otpDoc.save();
        res.status(200).json({
            success: true,
            message: "Otp verified successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.checkForgotPasswordOtp = checkForgotPasswordOtp;
// set new password
const newPasswordSet = async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const otpDoc = await otpModel_1.Otp.findOne({ email });
        if (!otpDoc) {
            return res.status(404).json({
                success: false,
                message: "Otp not found",
            });
        }
        if (!otpDoc.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Otp not verified",
            });
        }
        if (otpDoc.type !== "resetPassword") {
            return res.status(400).json({
                success: false,
                message: "Invalid otp type",
            });
        }
        if (otpDoc.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp",
            });
        }
        user.password = password;
        await user.save();
        // delete otp
        await otpModel_1.Otp.deleteMany({ email });
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.newPasswordSet = newPasswordSet;
//# sourceMappingURL=forgotPassword.js.map