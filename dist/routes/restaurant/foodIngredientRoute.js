"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodIngredientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../middleware/fileUploader");
const foodIngredientController_1 = require("../../controllers/restaurant/foodIngredientController");
const router = express_1.default.Router();
router.post("/create", fileUploader_1.uploadImage.single("ingredient_image"), foodIngredientController_1.createFoodIngredient);
router.get("/all", foodIngredientController_1.getAllFoodIngredients);
router.get("/:id", foodIngredientController_1.getSingleFoodIngredient);
router.put("/update/:id", fileUploader_1.uploadImage.single("ingredient_image"), foodIngredientController_1.updateFoodIngredient);
router.put("/status-change/:id", foodIngredientController_1.statusChangeFoodIngredient);
router.delete("/delete/:id", foodIngredientController_1.deleteFoodIngredient);
exports.FoodIngredientRoutes = router;
//# sourceMappingURL=foodIngredientRoute.js.map