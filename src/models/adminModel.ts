import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  profile_image?: string;
  role: "Super Admin" | "Admin" | "Staff";
  status: "Active" | "Pending" | "Blocked";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
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

    profile_image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["Super Admin", "Admin", "Staff"],
      default: "Admin",
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Blocked"],
      default: "Active",
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
AdminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * 🔐 Instance Method: Compare Password
 */
AdminSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Admin = model<IAdmin>("Admin", AdminSchema);
