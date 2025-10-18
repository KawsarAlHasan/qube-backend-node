import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../config/config";
import { Admin } from "../models/adminModel";

dotenv.config();

export default async function verifyAdminToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in",
      });
    }

    jwt.verify(
      token,
      config.jwt_secret as string,
      async (err, decoded: any) => {
        if (err) {
          return res.status(403).send({
            success: false,
            message: "Forbidden access",
          });
        }

        const _id = decoded.id;

        const admin = await Admin.findById(_id);

        if (!admin) {
          return res.status(404).json({
            success: false,
            message: "Admin not found. Please login again",
          });
        }

        (req as any).decodedAdmin = admin;
        next();
      }
    );
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: "Invalid Token",
      error: error.message,
    });
  }
}
