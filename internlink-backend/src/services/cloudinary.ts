import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

const cloudinaryUrl = process.env.CLOUDINARY_URL?.replace(/[<>]/g, "").trim();

if (cloudinaryUrl) {
  cloudinary.config({ url: cloudinaryUrl });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.replace(/[<>]/g, "").trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.replace(/[<>]/g, "").trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.replace(/[<>]/g, "").trim(),
  });
}

// In-memory document buffer cache with 2-hour TTL
interface CacheEntry {
  buffer: Buffer;
  expiresAt: number;
}
const bufferCache = new Map<string, CacheEntry>();

export function setFileCache(url: string, buffer: Buffer, ttlMs = 1000 * 60 * 60 * 2): void {
  bufferCache.set(url, { buffer, expiresAt: Date.now() + ttlMs });
}

export function getFileCache(url: string): Buffer | null {
  const entry = bufferCache.get(url);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    bufferCache.delete(url);
    return null;
  }
  return entry.buffer;
}

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
          const url = result!.secure_url;
          // Pre-populate buffer cache right upon upload
          setFileCache(url, buffer);
          resolve(url);
        }
      )
      .end(buffer);
  });
}

/**
 * Downloads multiple Cloudinary files in a single bundled archive request
 * and utilizes in-memory buffer caching to minimize latency to near zero.
 */
export async function downloadCloudinaryFiles(urls: string[]): Promise<Map<string, Buffer>> {
  const result = new Map<string, Buffer>();
  const uncachedUrls: string[] = [];

  for (const url of urls) {
    const cached = getFileCache(url);
    if (cached) {
      result.set(url, cached);
    } else {
      uncachedUrls.push(url);
    }
  }

  // All files already in memory cache
  if (uncachedUrls.length === 0) {
    return result;
  }

  const { default: yauzl } = await import("yauzl");

  // Map URLs to public_ids
  const urlToPublicId = new Map<string, string>();
  const publicIds: string[] = [];

  for (const url of uncachedUrls) {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (match) {
      const publicId = match[1];
      urlToPublicId.set(url, publicId);
      publicIds.push(publicId);
    }
  }

  if (publicIds.length === 0) return result;

  // Generate a single signed archive download URL for all files together
  const archiveUrl = (cloudinary.utils as any).download_archive_url({
    public_ids: publicIds,
    resource_type: "raw",
    target_format: "zip",
    flatten_folders: true,
  });

  const response = await fetch(archiveUrl);
  if (!response.ok) {
    throw new Error(`Cloudinary archive download failed: ${response.status}`);
  }

  const zipBuffer = Buffer.from(await response.arrayBuffer());

  // Extract all files from the ZIP in a single pass
  const extractedMap = await new Promise<Map<string, Buffer>>((resolve, reject) => {
    const map = new Map<string, Buffer>();
    yauzl.fromBuffer(zipBuffer, { lazyEntries: true }, (err, zip) => {
      if (err || !zip) return reject(err || new Error("Could not open ZIP"));
      zip.readEntry();
      zip.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zip.readEntry();
          return;
        }
        zip.openReadStream(entry, (err2, stream) => {
          if (err2 || !stream) return reject(err2 || new Error("No stream"));
          const chunks: Buffer[] = [];
          stream.on("data", (c: Buffer) => chunks.push(c));
          stream.on("end", () => {
            map.set(entry.fileName, Buffer.concat(chunks));
            zip.readEntry();
          });
          stream.on("error", reject);
        });
      });
      zip.on("end", () => resolve(map));
      zip.on("error", reject);
    });
  });

  // Assign and cache each buffer
  for (const [url, publicId] of urlToPublicId.entries()) {
    const filename = publicId.split("/").pop() || publicId;
    const buf = extractedMap.get(filename) || extractedMap.get(publicId);
    if (buf) {
      setFileCache(url, buf);
      result.set(url, buf);
    }
  }

  return result;
}

/**
 * Backward-compatible single file download function.
 */
export async function downloadCloudinaryFile(secureUrl: string): Promise<Buffer> {
  const cached = getFileCache(secureUrl);
  if (cached) return cached;

  const map = await downloadCloudinaryFiles([secureUrl]);
  const buf = map.get(secureUrl);
  if (!buf) {
    throw new Error(`Failed to download file from Cloudinary: ${secureUrl}`);
  }
  return buf;
}
