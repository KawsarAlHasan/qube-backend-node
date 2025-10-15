"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFoodCategory = exports.categoryStatusChange = exports.updateFoodCategory = exports.createFoodCategory = exports.getSingleFoodCategory = exports.getAllFoodCategory = void 0;
const foodCategoryModal_1 = require("../../models/restaurant/foodCategoryModal");
// get all food category
const getAllFoodCategory = async (req, res) => {
    try {
        const { status } = req.query;
        // if status is not provided then show Active category
        const query = {};
        if (status !== "all") {
            query.category_status = status == "Deactive" ? "Deactive" : "Active";
        }
        const foodCategories = await foodCategoryModal_1.foodCategory.find(query);
        if (foodCategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No food categories found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Food categories fetched successfully",
            data: foodCategories,
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
exports.getAllFoodCategory = getAllFoodCategory;
// get single food category
const getSingleFoodCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await foodCategoryModal_1.foodCategory.findById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getSingleFoodCategory = getSingleFoodCategory;
// create food category
const createFoodCategory = async (req, res) => {
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
        const file = req.file;
        const imageUrl = file ? `${baseUrl}/public/files/${file.filename}` : null;
        const data = await foodCategoryModal_1.foodCategory.create({
            category_name,
            category_image: imageUrl,
        });
        res.status(200).json({
            success: true,
            message: "Food category created successfully",
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
exports.createFoodCategory = createFoodCategory;
// update food category
const updateFoodCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { category_name } = req.body;
        const preData = await foodCategoryModal_1.foodCategory.findById(id);
        if (!preData) {
            return res.status(404).json({
                success: false,
                message: "Food category not found",
            });
        }
        // Build base URL for uploaded file access
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const file = req.file;
        const imageUrl = file
            ? `${baseUrl}/public/files/${file.filename}`
            : preData.category_image;
        const categoryName = category_name ? category_name : preData.category_name;
        const data = await foodCategoryModal_1.foodCategory.findByIdAndUpdate(id, {
            category_name: categoryName,
            category_image: imageUrl,
        }, { new: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.updateFoodCategory = updateFoodCategory;
// category status change
const categoryStatusChange = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!status && status !== "Active" && status !== "Deactive") {
            return res.status(400).json({
                success: false,
                message: "Please provide status as Active or Deactive",
            });
        }
        const data = await foodCategoryModal_1.foodCategory.findByIdAndUpdate(id, { category_status: status }, { new: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.categoryStatusChange = categoryStatusChange;
// delete food category
const deleteFoodCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await foodCategoryModal_1.foodCategory.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.deleteFoodCategory = deleteFoodCategory;
//# sourceMappingURL=foodCategory.js.map