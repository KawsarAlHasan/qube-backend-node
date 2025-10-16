import express from "express";
import { AuthRoutes } from "./authRoute";
import { ForgotRoutes } from "./forgotPasswordRoute";
import { UserRoute } from "./userRoute";
import { FoodCategoryRoutes } from "./restaurant/foodCategoryRoute";
import { FoodIngredientRoutes } from "./restaurant/foodIngredientRoute";
import { FoodRoutes } from "./restaurant/foodRoute";
import { CartRoutes } from "./restaurant/cartRoute";
const router = express.Router();

const apiRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/forgot-password",
    route: ForgotRoutes,
  },
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/food",
    route: FoodRoutes,
  },
  {
    path: "/food-category",
    route: FoodCategoryRoutes,
  },
  {
    path: "/food-ingredient",
    route: FoodIngredientRoutes,
  },
  {
    path: "/cart",
    route: CartRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
