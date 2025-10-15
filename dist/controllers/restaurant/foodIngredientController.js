"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFoodIngredient = exports.statusChangeFoodIngredient = exports.updateFoodIngredient = exports.getSingleFoodIngredient = exports.createFoodIngredient = exports.getAllFoodIngredients = void 0;
const foodIngredientModal_1 = require("../../models/restaurant/foodIngredientModal");
// get all food ingredients
const getAllFoodIngredients = async (req, res) => {
    try {
        const { status } = req.query;
        // if status is not provided then show Active category
        const query = {};
        if (status !== "all") {
            query.ingredient_status = status == "Deactive" ? "Deactive" : "Active";
        }
        const foodIngredients = await foodIngredientModal_1.foodIngredient.find(query);
        if (foodIngredients.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No food ingredients found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Food ingredients fetched successfully",
            data: foodIngredients,
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
exports.getAllFoodIngredients = getAllFoodIngredients;
// create food ingredient
const createFoodIngredient = async (req, res) => {
    try {
        const { ingredient_name, price, cost_on_me, quentity, allow_backorder } = req.body;
        if (!ingredient_name || !price || !quentity) {
            return res.status(400).json({
                success: false,
                message: "Please provide ingredient_name, price, quentity required fields",
            });
        }
        // Build base URL for uploaded file access
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const file = req.file;
        const imageUrl = file ? `${baseUrl}/public/files/${file.filename}` : null;
        const data = await foodIngredientModal_1.foodIngredient.create({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.createFoodIngredient = createFoodIngredient;
// get single food ingredient
const getSingleFoodIngredient = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await foodIngredientModal_1.foodIngredient.findById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getSingleFoodIngredient = getSingleFoodIngredient;
// update food ingredient
const updateFoodIngredient = async (req, res) => {
    try {
        const id = req.params.id;
        const { ingredient_name, price, cost_on_me, quentity, allow_backorder } = req.body;
        const preData = await foodIngredientModal_1.foodIngredient.findById(id);
        if (!preData) {
            return res.status(404).json({
                success: false,
                message: "Food ingredient not found",
            });
        }
        // Build base URL for uploaded file access
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const file = req.file;
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
        const data = await foodIngredientModal_1.foodIngredient.findByIdAndUpdate(id, {
            ingredient_name: ingredientName,
            price: ingredientPrice,
            cost_on_me: ingredientCostOnMe,
            quentity: ingredientQuentity,
            allow_backorder: ingredientAllowBackorder,
            ingredient_image: imageUrl,
        }, { new: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.updateFoodIngredient = updateFoodIngredient;
// status change food ingredient
const statusChangeFoodIngredient = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!status && status !== "Active" && status !== "Deactive") {
            return res.status(400).json({
                success: false,
                message: "Please provide status as Active or Deactive",
            });
        }
        const data = await foodIngredientModal_1.foodIngredient.findByIdAndUpdate(id, { ingredient_status: status }, { new: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.statusChangeFoodIngredient = statusChangeFoodIngredient;
// delete food ingredient
const deleteFoodIngredient = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await foodIngredientModal_1.foodIngredient.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.deleteFoodIngredient = deleteFoodIngredient;
//# sourceMappingURL=foodIngredientController.js.map