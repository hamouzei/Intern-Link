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
 * Download a Cloudinary file using a signed URL (bypasses account access restrictions).
 */
export async function downloadCloudinaryFile(secureUrl: string): Promise<Buffer> {
  // Extract public_id from the secure URL (strip /upload/vXXX/ prefix)
  const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) throw new Error(`Cannot parse Cloudinary URL: ${secureUrl}`);
  // Remove file extension from public_id for the SDK call
  const publicIdWithExt = match[1]; // e.g. "internlink/cv/user-cv.pdf"

  // Generate a short-lived signed URL using our API credentials
  const signedUrl = cloudinary.url(publicIdWithExt, {
    resource_type: "raw",
    sign_url: true,
    type: "upload",
    secure: true,
  });

  const response = await fetch(signedUrl);
  if (!response.ok) {
    throw new Error(`Failed to download from Cloudinary: ${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}
