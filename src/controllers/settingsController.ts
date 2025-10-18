import { Request, Response } from "express";
import { Settings } from "../models/settingsModel";

// get settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    const type = req.params.type;

    const data = await Settings.findOne({ type });
    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Settings not found for ${type}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Settings fetched successfully for ${type}`,
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Please provide content",
      });
    }

    const data = await Settings.findOneAndUpdate(
      { type },
      { content },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Settings not found for ${type}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Settings updated successfully for ${type}`,
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
