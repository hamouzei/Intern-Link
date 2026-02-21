import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(
  buffer: Buffer,
  folder: string,
  publicId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          folder,
          public_id: publicId,
          format: "pdf",
          access_mode: "public",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      )
      .end(buffer);
  });
}

/**
 * Download a Cloudinary file directly via its public secure_url.
 * Files are uploaded with access_mode: "public" so a simple fetch works.
 */
export async function downloadCloudinaryFile(secureUrl: string): Promise<Buffer> {
  const response = await fetch(secureUrl);
  if (!response.ok) {
    throw new Error(`Failed to download file from Cloudinary: ${response.status} ${response.statusText} (url: ${secureUrl})`);
  }
  return Buffer.from(await response.arrayBuffer());
}
