import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(
        Buffer.isBuffer(chunk)
          ? chunk
          : Buffer.from(chunk)
      );
    }

    const body = Buffer.concat(chunks);

    console.log(
      "Upload received:",
      body.length,
      "bytes"
    );

    if (!body.length) {
      return res.status(400).json({
        error: "No image received",
      });
    }

    const blob = await put(
      `hh-goa-${Date.now()}.png`,
      body,
      {
        access: "public",
        contentType: "image/png",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    console.log(
      "Upload successful:",
      blob.url
    );

    return res.status(200).json({
      url: blob.url,
    });
  } catch (error) {
    console.error(
      "Upload error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to upload image",
    });
  }
}