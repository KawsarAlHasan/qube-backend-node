import express from "express";

import { uploadImage } from "../../middleware/fileUploader";
import { categoryStatusChange, createFoodCategory, deleteFoodCategory, getAllFoodCategory, getSingleFoodCategory, updateFoodCategory } from "../../controllers/restaurant/foodCategory";

const router = express.Router();
router.post(
  "/create",
  uploadImage.single("category_image"),
  createFoodCategory
);

router.get("/all", getAllFoodCategory)
router.get("/:id", getSingleFoodCategory)
router.put("/update/:id", uploadImage.single("category_image"), updateFoodCategory)
router.put("/status-change/:id", categoryStatusChange)
router.delete("/delete/:id", deleteFoodCategory)

export const FoodCategoryRoutes = router;
