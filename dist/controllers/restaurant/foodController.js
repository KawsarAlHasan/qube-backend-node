"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFood = exports.statusChangeFood = exports.updateFood = exports.getSingleFood = exports.getAllFood = exports.createFood = void 0;
const foodModel_1 = require("../../models/restaurant/foodModel");
// create food
const createFood = async (req, res) => {
    try {
        const { food_name, food_category, food_description, food_price, quentity, cost_on_me, colories, cook_time, food_ingredients, extra_ingredients, allow_backorder, } = req.body;
        if (!food_name || !food_category || !food_price || !quentity) {
            return res.status(400).json({
                success: false,
                message: "Please provide food_name, food_category, food_price, quentity required fields",
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
        const food_images = req.files && req.files.length > 0
            ? req.files.map((file) => `${baseUrl}/public/files/${file.filename}`)
            : [];
        const data = await foodModel_1.food.create({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.createFood = createFood;
// get all food
const getAllFood = async (req, res) => {
    try {
        const { food_name, category_name, start_price, end_price, food_status, page = 1, limit = 10, sort_by = "createdAt", sort_order = "desc", } = req.query;
        // Parse pagination + sorting safely
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
        const sortField = sort_by || "createdAt";
        const sortOrder = (sort_order === null || sort_order === void 0 ? void 0 : sort_order.toLowerCase()) === "asc" ? 1 : -1;
        // Build match stage
        const match = {};
        if (food_name)
            match.food_name = { $regex: food_name, $options: "i" };
        if (start_price || end_price) {
            match.food_price = {};
            if (start_price)
                match.food_price.$gte = Number(start_price);
            if (end_price)
                match.food_price.$lte = Number(end_price);
        }
        if (food_status)
            match.food_status = food_status;
        // If category_name provided we will filter after lookup using $regex on the joined field
        // Aggregate pipeline to support category_name filter and proper total count
        const pipeline = [
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
                $match: { "category.category_name": { $regex: category_name, $options: "i" } },
            });
        }
        // Count total after filters
        const countPipeline = [...pipeline, { $count: "total" }];
        const countRes = await foodModel_1.food.aggregate(countPipeline).exec();
        const total = countRes[0] ? countRes[0].total : 0;
        // Add sorting, pagination and project final shape (populate ingredients via separate lookups)
        pipeline.push({ $sort: { [sortField]: sortOrder } }, { $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });
        // Optionally populate ingredients and extra_ingredients using $lookup
        pipeline.push({
            $lookup: {
                from: "foodingredients",
                localField: "food_ingredients",
                foreignField: "_id",
                as: "food_ingredients",
            },
        }, {
            $lookup: {
                from: "foodingredients",
                localField: "extra_ingredients",
                foreignField: "_id",
                as: "extra_ingredients",
            },
        });
        const foods = await foodModel_1.food.aggregate(pipeline).exec();
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
            data: foods,
            total,
            page: pageNum,
            limit: limitNum,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getAllFood = getAllFood;
// get single food
const getSingleFood = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await foodModel_1.food
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getSingleFood = getSingleFood;
// update food
const updateFood = async (req, res) => { };
exports.updateFood = updateFood;
// status change
const statusChangeFood = async (req, res) => { };
exports.statusChangeFood = statusChangeFood;
// delete food
const deleteFood = async (req, res) => { };
exports.deleteFood = deleteFood;
//# sourceMappingURL=foodController.js.map