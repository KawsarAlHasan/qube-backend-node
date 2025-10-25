import { Schema, model, Document } from "mongoose";

export interface IOtp extends Document {
  otp: string;
  email: string;
  phone: string;
  otp_expired: Date;
  type: "emailVerification" | "phoneVerification" | "resetPassword";
  isVerified: boolean;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Otp = model<IOtp>("Otp", OtpSchema);
