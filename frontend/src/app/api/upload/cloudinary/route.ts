import { NextResponse } from "next/server";
import crypto from "crypto";

type UploadRequest = {
  imageData?: string;
  fileName?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as UploadRequest;
  const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  // accept both older and canonical env names for backwards-compatibility
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET;

  if (!cloudName) {
    return NextResponse.json({ error: "Missing Cloudinary cloud name" }, { status: 500 });
  }

  if (!body.imageData) {
    return NextResponse.json({ error: "imageData is required" }, { status: 400 });
  }

  const formData = new FormData();
  formData.append("file", body.imageData);
  formData.append("folder", "mthunzi-team");
  if (body.fileName) {
    formData.append("public_id", body.fileName.replace(/\.[^/.]+$/, ""));
  }

  if (uploadPreset) {
    formData.append("upload_preset", uploadPreset);
  } else {
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing Cloudinary API key or secret for signed uploads" },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = [
      `folder=mthunzi-team`,
      `timestamp=${timestamp}`,
      ...(body.fileName ? [`public_id=${body.fileName.replace(/\.[^/.]+$/, "")}`] : []),
    ];
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign.sort().join("&") + apiSecret)
      .digest("hex");

    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
  }

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message || "Cloudinary upload failed" },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}
