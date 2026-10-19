import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new Error("Foto harus berformat JPG, PNG, atau WEBP")
      );
      return;
    }

    callback(null, true);
  },
});

export default function uploadProfileImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload.single("avatar")(req, res, (error) => {
    if (error) {
      if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message: "Ukuran foto maksimal 2 MB",
        });
      }

      if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_COUNT"
      ) {
        return res.status(400).json({
          success: false,
          message: "Hanya boleh mengunggah satu foto",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengunggah foto",
      });
    }

    next();
  });
}
