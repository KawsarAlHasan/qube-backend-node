import express from "express";

import { uploadImage } from "../../middleware/fileUploader";
import {
  createFoodIngredient,
  deleteFoodIngredient,
  getAllFoodIngredients,
  getSingleFoodIngredient,
  statusChangeFoodIngredient,
  updateFoodIngredient,
} from "../../controllers/restaurant/foodIngredientController";

const router = express.Router();
router.post(
  "/create",
  uploadImage.single("ingredient_image"),
  createFoodIngredient
);
router.get("/all", getAllFoodIngredients);
router.get("/:id", getSingleFoodIngredient);
router.put(
  "/update/:id",
  uploadImage.single("ingredient_image"),
  updateFoodIngredient
);
router.put("/status-change/:id", statusChangeFoodIngredient);
router.delete("/delete/:id", deleteFoodIngredient);

export const FoodIngredientRoutes = router;
