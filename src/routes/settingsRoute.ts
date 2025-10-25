import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";

const router = express.Router();

router.get("/:type", getSettings);
router.put("/:type", updateSettings);

export const SettingsRoute = router;
