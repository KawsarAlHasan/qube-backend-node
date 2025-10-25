import { Request, Response } from "express";
import { foodCategory } from "../../models/restaurant/foodCategoryModal";

// get all food category
export const getAllFoodCategory = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    // if status is not provided then show Active category
    const query: any = {};

    if (status !== "all") {
      query.category_status = status == "Deactive" ? "Deactive" : "Active";
    }

    const foodCategories = await foodCategory.find(query);

 

    res.status(200).json({
      success: true,
      message: "Food categories fetched successfully",
      data: foodCategories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get single food category
export const getSingleFoodCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await foodCategory.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food category fetched successfully",
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

// create food category
export const createFoodCategory = async (req: Request, res: Response) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "Please provide category name",
      });
    }

    // Build base URL for uploaded file access
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const file = req.file as Express.Multer.File | undefined;
    const imageUrl = file ? `${baseUrl}/public/files/${file.filename}` : null;

    const data = await foodCategory.create({
      category_name,
      category_image: imageUrl,
    });

    res.status(200).json({
      success: true,
      message: "Food category created successfully",
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

// update food category
export const updateFoodCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { category_name } = req.body;

    const preData = await foodCategory.findById(id);
    if (!preData) {
      return res.status(404).json({
        success: false,
        message: "Food category not found",
      });
    }

    // Build base URL for uploaded file access
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const file = req.file as Express.Multer.File | undefined;
    const imageUrl = file
      ? `${baseUrl}/public/files/${file.filename}`
      : preData.category_image;

    const categoryName = category_name ? category_name : preData.category_name;

    const data = await foodCategory.findByIdAndUpdate(
      id,
      {
        category_name: categoryName,
        category_image: imageUrl,
      },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food category updated successfully",
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

// category status change
export const categoryStatusChange = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status && status !== "Active" && status !== "Deactive") {
      return res.status(400).json({
        success: false,
        message: "Please provide status as Active or Deactive",
      });
    }

    const data = await foodCategory.findByIdAndUpdate(
      id,
      { category_status: status },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food category status changed successfully",
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

// delete food category
export const deleteFoodCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await foodCategory.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food category deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
