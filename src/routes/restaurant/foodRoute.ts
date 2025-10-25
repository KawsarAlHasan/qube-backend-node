import express from "express";
import {
  createFood,
  deleteFood,
  getAllFood,
  getAllFoodAdmin,
  getSingleFood,
  statusChangeFood,
  updateFood,
} from "../../controllers/restaurant/foodController";
import { uploadImage } from "../../middleware/fileUploader";
import verifyUserToken from "../../middleware/verifyUserToken";

const router = express.Router();

router.post("/create", uploadImage.array("food_images", 10), createFood);
router.get("/all", getAllFood);
router.get("/admin", getAllFoodAdmin);
router.get("/:id", getSingleFood);
router.put("/update/:id", uploadImage.array("food_images", 10), updateFood);
router.put("/status-change/:id", statusChangeFood);
router.delete("/delete/:id", deleteFood);

export const FoodRoutes = router;
