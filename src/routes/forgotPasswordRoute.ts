import express from "express";
import { checkForgotPasswordOtp, newPasswordSet, sendForgotPasswordOtp } from "../controllers/forgotPassword";

const router = express.Router();

router.post("/send-reset-code", sendForgotPasswordOtp);
router.post("/check-reset-code", checkForgotPasswordOtp);
router.post("/set-new-password", newPasswordSet);

export const ForgotRoutes = router;
