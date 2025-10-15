import express from "express";
import { getAllUsers, getUserById, updateUserStatus } from "../controllers/userController";

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.put("/status-change/:id", updateUserStatus);

export const UserRoute = router;
