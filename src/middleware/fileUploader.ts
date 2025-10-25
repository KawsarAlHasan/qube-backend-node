import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Resolve upload directory and ensure it exists.
const UPLOAD_DIR = path.resolve(process.cwd(), "public", "files");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // ensure the folder exists at runtime (in case it was removed)
    if (!fs.existsSync(UPLOAD_DIR))
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const cleanFileName = file.originalname.replace(/\s+/g, "-");
    const ext = path.extname(cleanFileName).toLowerCase();
    const baseName = path.basename(cleanFileName, ext);

    const maxFileNameLength = 54 - (1 + ext.length);

    const shortBaseName =
      baseName.length > maxFileNameLength
        ? baseName.substring(0, maxFileNameLength)
        : baseName;

    // safer unique suffix generation
    const uniqueSuffix =
      Date.now().toString(36).slice(-5) +
      Math.random().toString(36).slice(2, 8);

    const finalName = `${shortBaseName}-${uniqueSuffix}${ext}`;
    cb(null, finalName);
  },
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedImageExts = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedImageExts.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Allowed: png, jpg, jpeg, svg, gif, webp")
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const videoUpload = multer({
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedVideoExts = [".mp4", ".mov", ".avi", ".mkv"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedVideoExts.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: mp4, mov, avi, mkv"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});

export { uploadImage, videoUpload };
