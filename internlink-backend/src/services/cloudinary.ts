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
 * Download a Cloudinary file using a private download URL.
 * For raw resources, the file extension is part of the public_id.
 */
export async function downloadCloudinaryFile(secureUrl: string): Promise<Buffer> {
  // Extract public_id from the secure URL (for raw resources, extension is part of the ID)
  const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) throw new Error(`Cannot parse Cloudinary URL: ${secureUrl}`);
  const publicId = match[1]; // e.g. "internlink/cv/user-cv.pdf" (full ID with extension)

  // Generate a time-limited authenticated download URL via the Cloudinary API
  const downloadUrl = cloudinary.utils.private_download_url(publicId, "", {
    resource_type: "raw",
    expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
  });

  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Cloudinary download failed: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

