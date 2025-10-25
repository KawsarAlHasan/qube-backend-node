import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  date_of_birth: Date;
  gender: "Male" | "Female" | "Other";
  profile_image?: string;
  is_verified: boolean;
  address?: string;
  role: "User" | "Driver" | "Instructor";
  status: "Active" | "Pending" | "Blocked";
  credit: number;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    profile_image: {
      type: String,
      default: "",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["User", "Driver", "Instructor"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Blocked"],
      default: "Active",
    },
    credit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * 🧂 Pre-save Hook: Password Hashing
 */
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * 🔐 Instance Method: Compare Password
 */
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model<IUser>("User", UserSchema);
