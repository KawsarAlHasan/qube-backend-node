import express from "express";
import {
  adminStatusChange,
  createAdmin,
  deleteAdmin,
  getAdminProfile,
  getAllAdmin,
  getSingleAdmin,
  loginAdmin,
  updateAdminProfile,
  updatePassword,
} from "../controllers/adminController";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { uploadImage } from "../middleware/fileUploader";

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.get("/profile", verifyAdminToken, getAdminProfile);
router.put("/update", uploadImage.single("profile_image"), verifyAdminToken, updateAdminProfile);
router.put("/status-change/:id", verifyAdminToken, adminStatusChange);
router.put("/change-password", verifyAdminToken, updatePassword);
router.get("/all", verifyAdminToken, getAllAdmin);
router.get("/:id", verifyAdminToken, getSingleAdmin);
router.delete("/delete/:id", verifyAdminToken, deleteAdmin);

export const AdminRoute = router;
