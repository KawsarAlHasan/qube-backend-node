"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    date_of_birth: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    profile_image: {
        type: String,
        default: "",
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ["User", "Driver"],
        default: "User",
    },
    status: {
        type: String,
        enum: ["Active", "Pending", "Blocked"],
        default: "Active",
    }
}, {
    timestamps: true,
    versionKey: false,
});
/**
 * 🧂 Pre-save Hook: Password Hashing
 */
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
/**
 * 🔐 Instance Method: Compare Password
 */
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
exports.User = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=userModel.js.map