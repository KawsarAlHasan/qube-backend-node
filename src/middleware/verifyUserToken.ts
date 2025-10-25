import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../config/config";
import { User } from "../models/userModel";

dotenv.config();

export default async function verifyUserToken(
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

        const user = await User.findById(_id);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found. Please login again",
          });
        }

        (req as any).decodedUser = user;
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
