"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updatePassword = exports.updateProfile = exports.getProfile = exports.resendVerifyEmailOtp = exports.verifyEmailOtp = exports.signUpUser = exports.emailLogin = void 0;
const userModel_1 = require("../models/userModel");
const emailerService_1 = require("../middleware/emailerService");
const otpModel_1 = require("../models/otpModel");
const generateToken_1 = require("../config/generateToken");
// email login
const emailLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        // so include it explicitly when fetching the user for login.
        const user = await userModel_1.User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const jwtToken = (0, generateToken_1.generateUserToken)(user);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                token: jwtToken,
                user,
            },
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
exports.emailLogin = emailLogin;
// sign up user
const signUpUser = async (req, res) => {
    try {
        const { email, password, phone, date_of_birth, gender } = req.body;
        if (!email || !password || !phone || !date_of_birth || !gender) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, password, phone, date_of_birth, gender fields",
            });
        }
        // gender
        if (gender !== "Male" && gender !== "Female" && gender !== "Other") {
            return res.status(400).json({
                success: false,
                message: "Gender must be Male, Female or Other",
            });
        }
        // password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }
        // email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }
        const existingUser = await userModel_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // phone
        const existingPhone = await userModel_1.User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "Phone number already exists",
            });
        }
        const user = await userModel_1.User.create({
            email,
            password,
            phone,
            date_of_birth,
            gender,
        });
        // Generate a 6-digit reset code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        // create otp
        await otpModel_1.Otp.create({
            otp: verificationCode,
            email: user.email,
            phone: user.phone,
            otp_expired: new Date(Date.now() + 7 * 60 * 60 * 1000),
            type: "emailVerification",
        });
        await (0, emailerService_1.sendVerifyEmail)(user.email, verificationCode);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
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
exports.signUpUser = signUpUser;
// verify email otp
const verifyEmailOtp = async (req, res) => {
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
        if (otpDoc.type !== "emailVerification") {
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
        user.is_verified = true;
        await user.save();
        await otpModel_1.Otp.findByIdAndDelete(otpDoc._id);
        const jwtToken = (0, generateToken_1.generateUserToken)(user);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: {
                token: jwtToken,
                user,
            },
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
exports.verifyEmailOtp = verifyEmailOtp;
// resend verify email otp
const resendVerifyEmailOtp = async (req, res) => {
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
        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: "User already verified",
            });
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpDoc = await otpModel_1.Otp.findOne({ email });
        if (otpDoc) {
            otpDoc.otp = verificationCode;
            otpDoc.type = "resetPassword";
            otpDoc.otp_expired = new Date(Date.now() + 7 * 60 * 60 * 1000);
            await otpDoc.save();
        }
        else {
            await otpModel_1.Otp.create({
                email,
                otp: verificationCode,
                type: "resetPassword",
                otp_expired: new Date(Date.now() + 7 * 60 * 60 * 1000),
            });
        }
        await (0, emailerService_1.sendVerifyEmail)(user.email, verificationCode);
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
exports.resendVerifyEmailOtp = resendVerifyEmailOtp;
// get user profile
const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User profile",
            data: req.decodedUser,
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
exports.getProfile = getProfile;
// update profile controller
const updateProfile = async (req, res) => {
    try {
        const user = req.decodedUser;
        const { name, phone, date_of_birth, gender, address } = req.body;
        // Build base URL for uploaded file access
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const file = req.file;
        const imageUrl = file
            ? `${baseUrl}/public/files/${file.filename}`
            : user.profile_image;
        // Validate optional fields
        if (gender && !["Male", "Female", "Other"].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: "Gender must be Male, Female or Other",
            });
        }
        const update = {
            profile_image: imageUrl,
        };
        if (name)
            update.name = name;
        if (phone)
            update.phone = phone;
        if (date_of_birth)
            update.date_of_birth = date_of_birth
                ? new Date(date_of_birth)
                : undefined;
        if (gender)
            update.gender = gender;
        if (address)
            update.address = address;
        // Remove undefined values
        Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);
        const updatedUser = await userModel_1.User.findByIdAndUpdate(user._id, update, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            message: "User profile updated",
            data: updatedUser,
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
exports.updateProfile = updateProfile;
// update password controller
const updatePassword = async (req, res) => {
    try {
        const decoded = req.decodedUser;
        const { current_password, new_password } = req.body;
        if (!current_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: "Please provide current_password and new_password",
            });
        }
        if (typeof new_password !== "string" || new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }
        // decoded may be the JWT payload (with `id`) or a user object with `_id`.
        const userId = decoded._id;
        // Fetch the DB user including the password hash (schema sets select: false)
        const user = await userModel_1.User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await user.comparePassword(current_password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }
        // Assign new password (pre-save hook will hash it)
        user.password = new_password;
        await user.save();
        res.status(200).json({ success: true, message: "Password updated" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.updatePassword = updatePassword;
// delete user
const deleteUser = async (req, res) => {
    try {
        const decoded = req.decodedUser;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please provide password",
            });
        }
        // decoded may be the JWT payload (with `id`) or a user object with `_id`.
        const userId = decoded._id;
        // Fetch the DB user including the password hash (schema sets select: false)
        const user = await userModel_1.User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }
        await userModel_1.User.findByIdAndDelete(userId);
        res.status(200).json({
            success: true,
            message: "User deleted",
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
exports.deleteUser = deleteUser;
//# sourceMappingURL=authController.js.map