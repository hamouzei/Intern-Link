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
 * Download a Cloudinary file using API credentials (Basic Auth).
 * This bypasses any account-level access restrictions.
 */
export async function downloadCloudinaryFile(secureUrl: string): Promise<Buffer> {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET");
  }

  // Use Basic Auth header with API credentials
  const authHeader = "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const response = await fetch(secureUrl, {
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    throw new Error(`Cloudinary download failed: ${response.status} ${response.statusText} (url: ${secureUrl})`);
  }

  return Buffer.from(await response.arrayBuffer());
}

