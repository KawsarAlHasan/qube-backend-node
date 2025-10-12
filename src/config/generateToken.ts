import jwt from "jsonwebtoken";
import config from "./config";

export const generateUserToken = (user: any) => {
  const payload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "60days",
  });

  return token;
};
