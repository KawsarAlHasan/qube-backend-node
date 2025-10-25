import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";
import { StatusCodes } from "http-status-codes";
import router from "./routes/indexRoute";
const app = express();

//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true })); // To handle URL-encoded data

// Serve static files for uploaded images
app.use("/public", express.static(path.join(__dirname, "../public")));

//router
app.use('/api/v1', router);

//live response
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
