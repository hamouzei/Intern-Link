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
 * Download a Cloudinary resource as a buffer.
 * Uses the Cloudinary archive API which bypasses account-level access restrictions.
 * Returns the raw PDF bytes extracted from the downloaded ZIP.
 */
export async function downloadCloudinaryFile(secureUrl: string): Promise<Buffer> {
  const { default: yauzl } = await import("yauzl");

  // Extract public_id from the secure URL
  const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) throw new Error(`Cannot parse Cloudinary URL: ${secureUrl}`);
  const publicId = match[1]; // for raw resources, public_id includes the extension

  // Generate a signed archive download URL (works even for restricted resources)
  const archiveUrl = (cloudinary.utils as any).download_archive_url({
    public_ids: [publicId],
    resource_type: "raw",
    target_format: "zip",
    flatten_folders: true,
  });

  const response = await fetch(archiveUrl);
  if (!response.ok) {
    throw new Error(`Cloudinary archive download failed for "${publicId}": ${response.status}`);
  }

  const zipBuffer = Buffer.from(await response.arrayBuffer());

  // Extract the first file from the ZIP
  return new Promise<Buffer>((resolve, reject) => {
    yauzl.fromBuffer(zipBuffer, { lazyEntries: true }, (err, zip) => {
      if (err || !zip) return reject(err || new Error("Could not open ZIP"));
      zip.readEntry();
      zip.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zip.readEntry(); // directory, skip
          return;
        }
        zip.openReadStream(entry, (err2, stream) => {
          if (err2 || !stream) return reject(err2 || new Error("No stream"));
          const chunks: Buffer[] = [];
          stream.on("data", (c: Buffer) => chunks.push(c));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        });
      });
      zip.on("error", reject);
      zip.on("end", () => reject(new Error("No files found in archive")));
    });
  });
}

