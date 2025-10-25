import express from "express";
import {
  createCredit,
  deleteCredit,
  editCredit,
  getAllCredit,
  statusChangeCredit,
} from "../../controllers/spa/creditController";

const router = express.Router();

router.post("/create", createCredit);
router.get("/all", getAllCredit);
router.put("/update/:id", editCredit);
router.put("/status-change/:id", statusChangeCredit);
router.delete("/delete/:id", deleteCredit);

export const CreditRoute = router;
