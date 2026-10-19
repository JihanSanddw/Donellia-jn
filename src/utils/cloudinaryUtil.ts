
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
