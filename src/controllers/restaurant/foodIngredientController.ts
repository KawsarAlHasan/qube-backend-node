import { Request, Response } from "express";
import { foodIngredient } from "../../models/restaurant/foodIngredientModal";

// get all food ingredients
export const getAllFoodIngredients = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    // if status is not provided then show Active category
    const query: any = {};

    if (status !== "all") {
      query.ingredient_status = status == "Deactive" ? "Deactive" : "Active";
    }

    const foodIngredients = await foodIngredient.find(query);

    res.status(200).json({
      success: true,
      message: "Food ingredients fetched successfully",
      data: foodIngredients,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// create food ingredient
export const createFoodIngredient = async (req: Request, res: Response) => {
  try {
    const { ingredient_name, price, cost_on_me, quentity, allow_backorder } =
      req.body;

    if (!ingredient_name || !price || !quentity) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide ingredient_name, price, quentity required fields",
      });
    }

    // Build base URL for uploaded file access
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const file = req.file as Express.Multer.File | undefined;
    const imageUrl = file ? `${baseUrl}/public/files/${file.filename}` : null;

    const data = await foodIngredient.create({
      ingredient_name,
      price,
      cost_on_me,
      quentity,
      allow_backorder,
      ingredient_image: imageUrl,
    });

    res.status(200).json({
      success: true,
      message: "Food ingredient created successfully",
      data: data,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get single food ingredient
export const getSingleFoodIngredient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await foodIngredient.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food ingredient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food ingredient fetched successfully",
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

// update food ingredient
export const updateFoodIngredient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { ingredient_name, price, cost_on_me, quentity, allow_backorder } =
      req.body;

    const preData = await foodIngredient.findById(id);
    if (!preData) {
      return res.status(404).json({
        success: false,
        message: "Food ingredient not found",
      });
    }

    // Build base URL for uploaded file access
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const file = req.file as Express.Multer.File | undefined;
    const imageUrl = file
      ? `${baseUrl}/public/files/${file.filename}`
      : preData.ingredient_image;

    const ingredientName = ingredient_name
      ? ingredient_name
      : preData.ingredient_name;
    const ingredientPrice = price ? price : preData.price;
    const ingredientCostOnMe = cost_on_me ? cost_on_me : preData.cost_on_me;
    const ingredientQuentity = quentity ? quentity : preData.quentity;
    const ingredientAllowBackorder = allow_backorder
      ? allow_backorder
      : preData.allow_backorder;

    const data = await foodIngredient.findByIdAndUpdate(
      id,
      {
        ingredient_name: ingredientName,
        price: ingredientPrice,
        cost_on_me: ingredientCostOnMe,
        quentity: ingredientQuentity,
        allow_backorder: ingredientAllowBackorder,
        ingredient_image: imageUrl,
      },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food ingredient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food ingredient updated successfully",
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

// status change food ingredient
export const statusChangeFoodIngredient = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status && status !== "Active" && status !== "Deactive") {
      return res.status(400).json({
        success: false,
        message: "Please provide status as Active or Deactive",
      });
    }

    const data = await foodIngredient.findByIdAndUpdate(
      id,
      { ingredient_status: status },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food ingredient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food ingredient status changed successfully",
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

// delete food ingredient
export const deleteFoodIngredient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await foodIngredient.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food ingredient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food ingredient deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
