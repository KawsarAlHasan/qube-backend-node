"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoUpload = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Resolve upload directory and ensure it exists.
const UPLOAD_DIR = path_1.default.resolve(process.cwd(), "public", "files");
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        // ensure the folder exists at runtime (in case it was removed)
        if (!fs_1.default.existsSync(UPLOAD_DIR))
            fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const cleanFileName = file.originalname.replace(/\s+/g, "-");
        const ext = path_1.default.extname(cleanFileName).toLowerCase();
        const baseName = path_1.default.basename(cleanFileName, ext);
        const maxFileNameLength = 54 - (1 + ext.length);
        const shortBaseName = baseName.length > maxFileNameLength
            ? baseName.substring(0, maxFileNameLength)
            : baseName;
        // safer unique suffix generation
        const uniqueSuffix = Date.now().toString(36).slice(-5) +
            Math.random().toString(36).slice(2, 8);
        const finalName = `${shortBaseName}-${uniqueSuffix}${ext}`;
        cb(null, finalName);
    },
});
const uploadImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedImageExts = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedImageExts.includes(extension)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Allowed: png, jpg, jpeg, svg, gif, webp"));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
exports.uploadImage = uploadImage;
const videoUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedVideoExts = [".mp4", ".mov", ".avi", ".mkv"];
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedVideoExts.includes(extension)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Allowed: mp4, mov, avi, mkv"));
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB
    },
});
exports.videoUpload = videoUpload;
//# sourceMappingURL=fileUploader.js.map