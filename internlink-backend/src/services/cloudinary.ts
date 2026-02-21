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
 * This uses the Cloudinary API endpoint (not CDN) with proper authentication,
 * which works even when the account has strict access settings.
 */
export async function downloadCloudinaryFile(secureUrl: string): Promise<Buffer> {
  // Extract public_id from the secure URL
  const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) throw new Error(`Cannot parse Cloudinary URL: ${secureUrl}`);
  const publicIdWithExt = match[1]; // e.g. "internlink/cv/user-cv.pdf"

  // Strip file extension to get pure public_id
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
  const ext = publicIdWithExt.match(/\.([^/.]+)$/)?.[1] || "pdf";

  // Generate a time-limited authenticated download URL via the Cloudinary API
  const downloadUrl = cloudinary.utils.private_download_url(publicId, ext, {
    resource_type: "raw",
    expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
  });

  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Cloudinary download failed: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

