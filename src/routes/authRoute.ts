import express from "express";
import {
    deleteUser,
  emailLogin,
  getProfile,
  signUpUser,
  updatePassword,
  updateProfile,
  verifyEmailOtp,
} from "../controllers/authController";
import verifyUserToken from "../middleware/verifyUserToken";
import { uploadImage } from "../middleware/fileUploader";

const router = express.Router();

router.post("/email/login", emailLogin);
router.post("/email/signup", signUpUser);
router.post("/email/verify", verifyEmailOtp);

router.get("/profile", verifyUserToken, getProfile);
router.put(
  "/update",
  verifyUserToken,
  uploadImage.single("profile_image"),
  updateProfile
);

router.put("/change-password", verifyUserToken, updatePassword);
router.delete("/delete", verifyUserToken, deleteUser);

export const AuthRoutes = router;
