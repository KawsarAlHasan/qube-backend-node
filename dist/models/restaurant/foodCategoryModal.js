"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodCategory = void 0;
const mongoose_1 = require("mongoose");
const foodCategorySchema = new mongoose_1.Schema({
    category_name: {
        type: String,
        required: true,
    },
    category_image: {
        type: String,
        default: null,
    },
    category_status: {
        type: String,
        enum: ["Active", "Deactive"],
        default: "Active",
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.foodCategory = (0, mongoose_1.model)("foodCategory", foodCategorySchema);
//# sourceMappingURL=foodCategoryModal.js.map