import express from "express";
import {
  createSpa,
  deleteSpa,
  getAllSpa,
  getSingleSpa,
  spaStatusChange,
  updateSpa,
} from "../../controllers/spa/spaController";
import { uploadImage } from "../../middleware/fileUploader";

const router = express.Router();

router.post("/create", uploadImage.array("images", 10), createSpa);
router.get("/all", getAllSpa);
router.get("/:id", getSingleSpa);
router.put("/update/:id", uploadImage.array("images", 10), updateSpa);
router.put("/status-change/:id", spaStatusChange);
router.delete("/delete/:id", deleteSpa);

export const SpaRoute = router;
