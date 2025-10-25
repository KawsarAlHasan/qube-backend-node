"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.food = void 0;
const mongoose_1 = require("mongoose");
const foodSchema = new mongoose_1.Schema({
    food_name: {
        type: String,
        required: true,
    },
    food_category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "foodCategory",
        required: true,
    },
    food_description: {
        type: String,
        default: null,
    },
    quentity: {
        type: Number,
        required: true,
    },
    food_price: {
        type: Number,
        required: true,
    },
    cost_on_me: {
        type: Number,
        default: 0,
    },
    colories: {
        type: String,
        default: null,
    },
    cook_time: {
        type: String,
        default: null,
    },
    food_ingredients: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "foodIngredient",
        },
    ],
    extra_ingredients: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "foodIngredient",
        },
    ],
    food_images: [
        {
            type: String,
        },
    ],
    allow_backorder: {
        type: Boolean,
        default: true,
    },
    food_status: {
        type: String,
        enum: ["Active", "Deactive"],
        default: "Active",
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.food = (0, mongoose_1.model)("food", foodSchema);
//# sourceMappingURL=foodModel.js.map