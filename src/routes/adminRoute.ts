import express from "express";
import {
  createAdmin,
  getAdminProfile,
  loginAdmin,
} from "../controllers/adminController";
import verifyAdminToken from "../middleware/verifyAdminToken";

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.get("/profile", verifyAdminToken, getAdminProfile);
// adminStatusChange
// router.put("/update", verifyAdminToken, createAdmin);

export const AdminRoute = router;
