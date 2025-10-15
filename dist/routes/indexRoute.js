"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoute_1 = require("./authRoute");
const forgotPasswordRoute_1 = require("./forgotPasswordRoute");
const userRoute_1 = require("./userRoute");
const foodCategoryRoute_1 = require("./restaurant/foodCategoryRoute");
const foodIngredientRoute_1 = require("./restaurant/foodIngredientRoute");
const foodRoute_1 = require("./restaurant/foodRoute");
const router = express_1.default.Router();
const apiRoutes = [
    {
        path: "/auth",
        route: authRoute_1.AuthRoutes,
    },
    {
        path: "/forgot-password",
        route: forgotPasswordRoute_1.ForgotRoutes,
    },
    {
        path: "/user",
        route: userRoute_1.UserRoute,
    },
    {
        path: "/food",
        route: foodRoute_1.FoodRoutes,
    },
    {
        path: "/food-category",
        route: foodCategoryRoute_1.FoodCategoryRoutes,
    },
    {
        path: "/food-ingredient",
        route: foodIngredientRoute_1.FoodIngredientRoutes,
    },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=indexRoute.js.map