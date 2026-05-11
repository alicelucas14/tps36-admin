import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, url } = await request.json();
    
    if (text && url) {
      const db = await getDb();
      await db.run(
        "INSERT INTO button_clicks (element_text, page_url) VALUES (?, ?)",
        [text, url]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
