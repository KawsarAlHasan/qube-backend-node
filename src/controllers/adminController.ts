import { Request, Response } from "express";
import { Admin } from "../models/adminModel";
import { generateAdminToken } from "../config/generateToken";

// create admin
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    if (role !== "Super Admin" && role !== "Admin" && role !== "Staff") {
      return res.status(400).json({
        success: false,
        message: "Role must be Super Admin, Admin or Staff",
      });
    }

    const phoneExists = await Admin.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this phone",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      phone,
      role,
    });

    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// login admin
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // so include it explicitly when fetching the user for login.
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const jwtToken = generateAdminToken(admin);

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token: jwtToken,
      data: admin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get admin profile
export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Admin profile",
      data: (req as any).decodedAdmin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update admin profile
export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).decodedAdmin;

    const { name, phone,} = req.body;

    // Build base URL for uploaded file access
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const file = req.file as Express.Multer.File | undefined;
    const imageUrl = file
      ? `${baseUrl}/public/files/${file.filename}`
      : admin.profile_image;

 

    const update: Partial<any> = {
      profile_image: imageUrl,
    };

    if (name) update.name = name;
    if (phone) update.phone = phone;

    const data = await Admin.findByIdAndUpdate(admin._id, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// admin status change
export const adminStatusChange = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (
      !status &&
      status !== "Active" &&
      status !== "Pending" &&
      status !== "Blocked"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide status as Active, Pending or Blocked",
      });
    }
    const data = await Admin.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Admin status changed successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete admin
export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await Admin.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get all admin
export const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const data = await Admin.find();
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Admin fetched successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get single admin
export const getSingleAdmin = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await Admin.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Admin fetched successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




// update password controller
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const decoded = (req as any).decodedAdmin;

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

    // decoded may be the JWT payload (with `id`) or a admin object with `_id`.
    const adminId = decoded._id;

    // Fetch the DB admin including the password hash (schema sets select: false)
    const admin = await Admin.findById(adminId).select("+password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isPasswordValid = await admin.comparePassword(current_password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Assign new password (pre-save hook will hash it)
    admin.password = new_password;
    await admin.save();

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
