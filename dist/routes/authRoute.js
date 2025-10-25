"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifyUserToken_1 = __importDefault(require("../middleware/verifyUserToken"));
const fileUploader_1 = require("../middleware/fileUploader");
const router = express_1.default.Router();
router.post("/email/login", authController_1.emailLogin);
router.post("/email/signup", authController_1.signUpUser);
router.post("/email/verify", authController_1.verifyEmailOtp);
router.post("/email/resend-verify", authController_1.resendVerifyEmailOtp);
router.get("/profile", verifyUserToken_1.default, authController_1.getProfile);
router.put("/update", verifyUserToken_1.default, fileUploader_1.uploadImage.single("profile_image"), authController_1.updateProfile);
router.put("/change-password", verifyUserToken_1.default, authController_1.updatePassword);
router.delete("/delete", verifyUserToken_1.default, authController_1.deleteUser);
exports.AuthRoutes = router;
//# sourceMappingURL=authRoute.js.map