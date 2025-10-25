"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.getUserById = exports.getAllUsers = void 0;
const userModel_1 = require("../models/userModel");
// Get all users with filters & pagination
const getAllUsers = async (req, res) => {
    try {
        // Query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { name, email, phone, role, status, is_verified } = req.query;
        // Build filter query
        const query = {};
        if (name)
            query.name = { $regex: name, $options: "i" };
        if (email)
            query.email = { $regex: email, $options: "i" };
        if (phone)
            query.phone = { $regex: phone, $options: "i" };
        if (is_verified)
            query.is_verified = is_verified;
        if (role)
            query.role = role;
        if (status)
            query.status = status;
        // Count total documents
        const total = await userModel_1.User.countDocuments(query);
        // Fetch users with pagination
        const users = await userModel_1.User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }
        // Success response
        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: {
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                users,
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
exports.getAllUsers = getAllUsers;
// get sigle user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel_1.User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
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
exports.getUserById = getUserById;
// updated status
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Please provide status",
            });
        }
        const user = await userModel_1.User.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
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
exports.updateUserStatus = updateUserStatus;
//# sourceMappingURL=userController.js.map