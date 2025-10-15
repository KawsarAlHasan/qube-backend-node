import express from "express";
import {
  createFood,
  deleteFood,
  getAllFood,
  getSingleFood,
  statusChangeFood,
  updateFood,
} from "../../controllers/restaurant/foodController";
import { uploadImage } from "../../middleware/fileUploader";

const router = express.Router();

router.post("/create", uploadImage.array("food_images", 10), createFood);
router.get("/all", getAllFood);
router.get("/:id", getSingleFood);
router.put("/update/:id", uploadImage.array("food_images", 10), updateFood);
router.put("/status-change/:id", statusChangeFood);
router.delete("/delete/:id", deleteFood);

export const FoodRoutes = router;
