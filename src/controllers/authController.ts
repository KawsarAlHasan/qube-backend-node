import { Request, Response } from "express";
import { User } from "../models/userModel";
import { sendVerifyEmail } from "../middleware/emailerService";
import { Otp } from "../models/otpModel";
import { generateUserToken } from "../config/generateToken";

// email login
export const emailLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // so include it explicitly when fetching the user for login.
    const user = await User.findOne({ email }).select("+password");
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

    const jwtToken = generateUserToken(user);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token: jwtToken,
        user,
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

// create driver
export const createDriver = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, phone fields",
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
        message: "Invalid email format",
      });
    }

    // email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "Driver",
      is_verified: true,
    });

    res.status(200).json({
      success: true,
      message: "Driver created successfully",
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


// create Instructor
export const createInstructor = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, phone fields",
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
        message: "Invalid email format",
      });
    }

    // email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "Instructor",
      is_verified: true,
    });

    res.status(200).json({
      success: true,
      message: "Driver created successfully",
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

// sign up user
export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, date_of_birth, gender } = req.body;

    if (!name || !email || !password || !phone || !date_of_birth || !gender) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, email, password, phone, date_of_birth, gender fields",
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

    // email
    const existingUser = await User.findOne({
      email: email,
      is_verified: true,
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // phone
    const existingPhone = await User.findOne({
      phone: phone,
      is_verified: true,
    });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // delete unverified user
    await User.findOneAndDelete({ email: email, is_verified: false });
    await User.findOneAndDelete({ phone: phone, is_verified: false });
    await Otp.findOneAndDelete({ email: email });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      date_of_birth,
      gender,
    });

    // Generate a 6-digit reset code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // create or update OTP
    await Otp.findOneAndUpdate(
      { email: user.email },
      {
        otp: verificationCode,
        phone: user.phone,
        otp_expired: new Date(Date.now() + 7 * 60 * 60 * 1000),
        type: "emailVerification",
      },
      { upsert: true, new: true }
    );
    await sendVerifyEmail(user.email, verificationCode);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "User not created! Please try again",
      error: error.message,
    });
  }
};

// verify email otp
export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and otp",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpDoc = await Otp.findOne({ email });
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

    await Otp.findByIdAndDelete(otpDoc._id);

    const jwtToken = generateUserToken(user);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        token: jwtToken,
        user,
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

// resend verify email otp
export const resendVerifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });

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
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpDoc: any = await Otp.findOne({ email });
    if (otpDoc) {
      otpDoc.otp = verificationCode;
      otpDoc.type = "resetPassword";
      otpDoc.otp_expired = new Date(Date.now() + 7 * 60 * 60 * 1000);
      await otpDoc.save();
    } else {
      await Otp.create({
        email,
        otp: verificationCode,
        type: "resetPassword",
        otp_expired: new Date(Date.now() + 7 * 60 * 60 * 1000),
      });
    }

    await sendVerifyEmail(user.email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Otp sent successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "User profile",
      data: (req as any).decodedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update profile controller
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;

    const { name, phone, date_of_birth, gender, address } = req.body;

    // Build base URL for uploaded file access
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const file = req.file as Express.Multer.File | undefined;
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

    const update: Partial<any> = {
      profile_image: imageUrl,
    };

    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (date_of_birth)
      update.date_of_birth = date_of_birth
        ? new Date(date_of_birth)
        : undefined;
    if (gender) update.gender = gender;
    if (address) update.address = address;

    // Remove undefined values
    Object.keys(update).forEach(
      (k) => update[k] === undefined && delete update[k]
    );

    const updatedUser = await User.findByIdAndUpdate(user._id, update, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "User profile updated",
      data: updatedUser,
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
    const decoded = (req as any).decodedUser;

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
    const user = await User.findById(userId).select("+password");
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const decoded = (req as any).decodedUser;

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
    const user = await User.findById(userId).select("+password");
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

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
