
import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error("Foto harus berformat JPG, PNG, atau WEBP")
      );
    }
  },
});

export default function uploadProfileImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload.single("avatar")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof multer.MulterError &&
          error.code === "LIMIT_FILE_SIZE"
            ? "Ukuran foto maksimal 5 MB"
            : error.message,
      });
    }

    next();
  });
}
