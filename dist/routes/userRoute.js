"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/all", userController_1.getAllUsers);
router.get("/:id", userController_1.getUserById);
router.put("/status-change/:id", userController_1.updateUserStatus);
exports.UserRoute = router;
//# sourceMappingURL=userRoute.js.map