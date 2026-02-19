import * as dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  const publicId = "internlink/cv/Hs5Z0cgBh0EO1om5ReTGMaaWG5CGZ6u2-cv.pdf";

  // Use the correct SDK method: download_archive_url  
  const archiveUrl = (cloudinary.utils as any).download_archive_url({
    public_ids: [publicId],
    resource_type: "raw",
    target_format: "zip",
    flatten_folders: true,
  });
  console.log("Archive URL:", archiveUrl?.substring(0, 100));

  if (archiveUrl) {
    const r = await fetch(archiveUrl);
    console.log("Archive fetch:", r.status, r.headers.get("content-type"));
    if (r.ok) {
      const buf = await r.arrayBuffer();
      console.log("✅ Downloaded archive, size:", buf.byteLength);
    }
  }
})().catch(err => console.error("Error:", err.message || err));
