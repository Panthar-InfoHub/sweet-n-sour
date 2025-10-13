import { getCachedSignedUrls } from "@/lib/image-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { paths } = await request.json();

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: "Paths array is required" }, { status: 400 });
    }

    const urls = await getCachedSignedUrls(paths);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Error generating signed URLs:", error);
    return NextResponse.json({ error: "Failed to generate signed URLs" }, { status: 500 });
  }
}
