"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodIngredient = void 0;
const mongoose_1 = require("mongoose");
const foodIngredientSchema = new mongoose_1.Schema({
    ingredient_name: {
        type: String,
        required: true,
    },
    ingredient_image: {
        type: String,
        default: null,
    },
    price: {
        type: Number,
        default: 0,
    },
    cost_on_me: {
        type: Number,
        default: 0,
    },
    quentity: {
        type: Number,
        default: 0,
    },
    allow_backorder: {
        type: Boolean,
        default: true,
    },
    ingredient_status: {
        type: String,
        enum: ["Active", "Deactive"],
        default: "Active",
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.foodIngredient = (0, mongoose_1.model)("foodIngredient", foodIngredientSchema);
//# sourceMappingURL=foodIngredientModal.js.map