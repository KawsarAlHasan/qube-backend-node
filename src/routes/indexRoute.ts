import express from "express";
import { AuthRoutes } from "./authRoute";
import { ForgotRoutes } from "./forgotPasswordRoute";
import { UserRoute } from "./userRoute";
import { FoodCategoryRoutes } from "./restaurant/foodCategoryRoute";
import { FoodIngredientRoutes } from "./restaurant/foodIngredientRoute";
import { FoodRoutes } from "./restaurant/foodRoute";
import { CartRoutes } from "./restaurant/cartRoute";
import { SettingsRoute } from "./settingsRoute";
import { SpaRoute } from "./spa/spaRoute";
import { AdminRoute } from "./adminRoute";
import { FoodOrderRoute } from "./restaurant/foodOrderRoute";
import { AddressRoutes } from "./restaurant/addressRoute";
import { CreditRoute } from "./spa/creditRoute";
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
    path: "/food-order",
    route: FoodOrderRoute,
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
  {
    path: "/settings",
    route: SettingsRoute,
  },
  {
    path: "/spa",
    route: SpaRoute,
  },
  {
    path: "/admin",
    route: AdminRoute,
  },
  {
    path: "/credit",
    route: CreditRoute,
  },
  {
    path: "/address",
    route: AddressRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
