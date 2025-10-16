import express from "express";
import {
  addToCart,
  clearCart,
  getMyCart,
  removeFromCart,
  updateCart,
} from "../../controllers/restaurant/cartController";
import verifyUserToken from "../../middleware/verifyUserToken";

const router = express.Router();

router.post("/add", verifyUserToken, addToCart);
router.get("/", verifyUserToken, getMyCart);
router.put("/update", verifyUserToken, updateCart);
router.delete("/remove/:id", verifyUserToken, removeFromCart);
router.delete("/clear", verifyUserToken, clearCart);

export const CartRoutes = router;
