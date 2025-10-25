import express from "express";
import {
  createAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "../../controllers/restaurant/addressController";
import verifyUserToken from "../../middleware/verifyUserToken";

const router = express.Router();

router.get("/", verifyUserToken, getAllAddress);
router.post("/create", verifyUserToken, createAddress);
router.put("/update/:id", verifyUserToken, updateAddress);
router.delete("/delete/:id", verifyUserToken, deleteAddress);

export const AddressRoutes = router;
