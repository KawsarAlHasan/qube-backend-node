"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../middleware/fileUploader");
const foodCategory_1 = require("../../controllers/restaurant/foodCategory");
const router = express_1.default.Router();
router.post("/create", fileUploader_1.uploadImage.single("category_image"), foodCategory_1.createFoodCategory);
router.get("/all", foodCategory_1.getAllFoodCategory);
router.get("/:id", foodCategory_1.getSingleFoodCategory);
router.put("/update/:id", fileUploader_1.uploadImage.single("category_image"), foodCategory_1.updateFoodCategory);
router.put("/status-change/:id", foodCategory_1.categoryStatusChange);
router.delete("/delete/:id", foodCategory_1.deleteFoodCategory);
exports.FoodCategoryRoutes = router;
//# sourceMappingURL=foodCategoryRoute.js.map