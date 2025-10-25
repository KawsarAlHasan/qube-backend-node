import express from "express";
import {
  createFoodOrder,
  driverAssignFoodOrder,
  getAllFoodOrders,
  getDriverFoodOrders,
  getFoodOrderById,
  getMyFoodOrders,
  orderStatusChange,
} from "../../controllers/restaurant/foodOrderController";
import verifyUserToken from "../../middleware/verifyUserToken";

const router = express.Router();

router.post("/create", verifyUserToken, createFoodOrder);
router.put("/driver-assign/:id", driverAssignFoodOrder);
router.get("/driver-assign", verifyUserToken, getDriverFoodOrders);
router.get("/all", getAllFoodOrders);
router.get("/", verifyUserToken, getMyFoodOrders);
router.get("/:id", verifyUserToken, getFoodOrderById);
router.put("/status-change/:id", orderStatusChange);

export const FoodOrderRoute = router;
