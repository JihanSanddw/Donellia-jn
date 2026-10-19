
import cloudinary from "../config/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export function uploadImage(
  buffer: Buffer
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "denollia/avatars",
        resource_type: "image",
      },
      (error: any, result: any) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(
            new Error("Cloudinary tidak memberikan hasil upload")
          );
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export function getPublicIdFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname !== "res.cloudinary.com") {
      return null;
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    const publicIdParts = parts.slice(uploadIndex + 1);

    // Lewati versi gambar, misalnya v1729000000.
    if (/^v\d+$/.test(publicIdParts[0] ?? "")) {
      publicIdParts.shift();
    }

    const lastIndex = publicIdParts.length - 1;

    if (lastIndex < 0) {
      return null;
    }

    publicIdParts[lastIndex] = publicIdParts[lastIndex].replace(
      /\.[^/.]+$/,
      ""
    );

    const publicId = publicIdParts.join("/");

    return publicId || null;
  } catch {
    return null;
  }
}
