import { Request, Response } from "express";
import { food } from "../../models/restaurant/foodModel";
import { foodCategory } from "../../models/restaurant/foodCategoryModal";

// create food
export const createFood = async (req: Request, res: Response) => {
  try {
    const {
      food_name,
      food_category,
      food_description,
      food_price,
      quentity,
      cost_on_me,
      colories,
      cook_time,
      food_ingredients,
      extra_ingredients,
      allow_backorder,
    } = req.body;

    if (!food_name || !food_category || !food_price || !quentity) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide food_name, food_category, food_price, quentity required fields",
      });
    }

    const parsedFoodIngredients = food_ingredients
      ? JSON.parse(food_ingredients)
      : [];

    const parsedExtraIngredients = extra_ingredients
      ? JSON.parse(extra_ingredients)
      : [];

    // Base URL for images
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Create images urls from uploaded files
    const food_images =
      req.files && (req.files as Express.Multer.File[]).length > 0
        ? (req.files as Express.Multer.File[]).map(
            (file) => `${baseUrl}/public/files/${file.filename}`
          )
        : [];

    const data = await food.create({
      food_name,
      food_category,
      food_price,
      quentity,
      food_images,
      food_description,
      cost_on_me,
      colories,
      cook_time,
      allow_backorder,
      food_ingredients: parsedFoodIngredients,
      extra_ingredients: parsedExtraIngredients,
    });

    res.status(200).json({
      success: true,
      message: "Food created successfully",
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

// get all food
export const getAllFood = async (req: Request, res: Response) => {
  try {
    const foodsData = await food
      .find({ food_status: "Active" })
      .populate({ path: "food_category", select: "category_name" })
      .sort({ createdAt: -1 });

    if (!foodsData || foodsData.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No foods found",
        data: [],
      });
    }

    const foods = foodsData.map((item) => {
      const category = item.food_category as { category_name?: string };
      return {
        _id: item._id,
        food_name: item.food_name,
        food_images: item.food_images[0] || null,
        category_name: category?.category_name || null,
        food_price: item.food_price,
      };
    });

    const foodCategories = await foodCategory
      .find({ category_status: "Active" })
      .select("category_name");

    res.status(200).json({
      success: true,
      message: "Foods fetched successfully",
      banner: {
        _id: "68f5ddb2f3bdb3e3834eff92",
        title: "Get 30% off on your first order",
        food_image:
          "http://qube.dsrt321.online/public/files/Mens-Standard-Fit-Heathered-Short-Sleeve-V-Neck-T-sbdzcre6418.jpg",
      },
      categories: foodCategories,
      data: foods,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get all food
export const getAllFoodAdmin = async (req: Request, res: Response) => {
  try {
    const {
      food_name,
      category_name,
      start_price,
      end_price,
      food_status,
      page,
      limit,
      sort_by = "createdAt",
      sort_order = "desc",
      status
    } = req.query;
    // Parse pagination + sorting safely
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    const sortField = (sort_by as string) || "createdAt";
    const sortOrder = (sort_order as string)?.toLowerCase() === "asc" ? 1 : -1;

    // Build match stage
    const match: Record<string, any> = {};
    if (food_name)
      match.food_name = { $regex: food_name as string, $options: "i" };
    if (start_price || end_price) {
      match.food_price = {};
      if (start_price) match.food_price.$gte = Number(start_price);
      if (end_price) match.food_price.$lte = Number(end_price);
    }

    if (status !== "all") {
      match.food_status = status == "Deactive" ? "Deactive" : "Active";
    }

    // Aggregate pipeline to support category_name filter and proper total count
    const pipeline: any[] = [
      { $match: match },
      // lookup category to allow filtering & to return populated category
      {
        $lookup: {
          from: "foodcategories",
          localField: "food_category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ];

    if (category_name) {
      pipeline.push({
        $match: {
          "category.category_name": {
            $regex: category_name as string,
            $options: "i",
          },
        },
      });
    }

    // Count total after filters
    const countPipeline = [...pipeline, { $count: "total" }];
    const countRes = await (food as any).aggregate(countPipeline).exec();
    const total = countRes[0] ? countRes[0].total : 0;

    // Add sorting, pagination and project final shape (populate ingredients via separate lookups)
    pipeline.push(
      { $sort: { [sortField]: sortOrder } },
      { $skip: (pageNum - 1) * limitNum },
      { $limit: limitNum }
    );

    const foods = await (food as any).aggregate(pipeline).exec();

    if (!foods || foods.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No foods found",
        data: [],
        total,
        page: pageNum,
        limit: limitNum,
      });
    }

    res.status(200).json({
      success: true,
      message: "Foods fetched successfully",
      data: {
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
        foods,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get single food
export const getSingleFood = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await food
      .findById(id)
      .populate("food_category")
      .populate("food_ingredients")
      .populate("extra_ingredients");
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food fetched successfully",
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

// update food
export const updateFood = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const {
      food_name,
      food_category,
      food_description,
      food_price,
      quentity,
      cost_on_me,
      colories,
      cook_time,
      foodIngredients,
      extraIngredients,
      allow_backorder,
    } = req.body;

    const preData = await food.findByIdAndUpdate(id, req.body, { new: true });
    if (!preData) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const parsedFoodIngredients = foodIngredients
      ? JSON.parse(foodIngredients)
      : preData.food_ingredients;

    const parsedExtraIngredients = extraIngredients
      ? JSON.parse(extraIngredients)
      : preData.extra_ingredients;

    // Base URL for images
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Create images urls from uploaded files
    const food_images =
      req.files && (req.files as Express.Multer.File[]).length > 0
        ? (req.files as Express.Multer.File[]).map(
            (file) => `${baseUrl}/public/files/${file.filename}`
          )
        : preData.food_images;

    const data = await food.findByIdAndUpdate(
      id,
      {
        food_name: food_name || preData.food_name,
        food_category: food_category || preData.food_category,
        food_description: food_description || preData.food_description,
        food_price: food_price || preData.food_price,
        quentity: quentity || preData.quentity,
        cost_on_me: cost_on_me || preData.cost_on_me,
        colories: colories || preData.colories,
        cook_time: cook_time || preData.cook_time,
        food_ingredients: parsedFoodIngredients,
        extra_ingredients: parsedExtraIngredients,
        food_images,
        allow_backorder: allow_backorder || preData.allow_backorder,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
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

// status change
export const statusChangeFood = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { food_status } = req.body;
    if (
      !food_status &&
      food_status !== "Active" &&
      food_status !== "Deactive"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide food_status as Active or Deactive",
      });
    }
    const data = await food.findByIdAndUpdate(
      id,
      { food_status: food_status },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Food status changed successfully",
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

// delete food
export const deleteFood = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await food.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
