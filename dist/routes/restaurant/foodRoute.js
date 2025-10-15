"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodRoutes = void 0;
const express_1 = __importDefault(require("express"));
const foodController_1 = require("../../controllers/restaurant/foodController");
const fileUploader_1 = require("../../middleware/fileUploader");
const router = express_1.default.Router();
router.post("/create", fileUploader_1.uploadImage.array("food_images", 10), foodController_1.createFood);
router.get("/:id", foodController_1.getSingleFood);
exports.FoodRoutes = router;
//# sourceMappingURL=foodRoute.js.map