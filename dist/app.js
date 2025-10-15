"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = require("http-status-codes");
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const app = (0, express_1.default)();
//body parser
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//file retrieve
app.use(express_1.default.static("uploads"));
app.use(express_1.default.urlencoded({ extended: true })); // To handle URL-encoded data
// Serve static files for uploaded images
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
//router
app.use('/api/v1', indexRoute_1.default);
//live response
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public", "index.html"));
});
//handle not found route;
app.use((req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
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
exports.default = app;
//# sourceMappingURL=app.js.map