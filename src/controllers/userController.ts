import { Request, Response } from "express";
import { User } from "../models/userModel";

// Get all users with filters & pagination
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { name, email, phone, role, status, is_verified } = req.query;

    // Build filter query
    const query: Record<string, any> = {};
    if (name) query.name = { $regex: name as string, $options: "i" };
    if (email) query.email = { $regex: email as string, $options: "i" };
    if (phone) query.phone = { $regex: phone as string, $options: "i" };
    if (is_verified) query.is_verified = is_verified;
    if (role) query.role = role;
    if (status) query.status = status;

    // Count total documents
    const total = await User.countDocuments(query);

    // Fetch users with pagination
    const users = await User.find(query)
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get sigle user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// updated status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
