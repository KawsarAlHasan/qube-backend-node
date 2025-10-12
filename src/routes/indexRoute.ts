import express from "express";
import { AuthRoutes } from "./authRoute";
const router = express.Router();

const apiRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
