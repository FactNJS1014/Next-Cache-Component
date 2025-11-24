import { NextResponse } from "next/server";
import { chromium } from "playwright";

export async function POST(req: Request) {
  const { html } = await req.json();

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // render HTML + Tailwind CSS
  await page.setContent(html, { waitUntil: "networkidle" });

  // สร้าง PDF
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true, // จำเป็นเพื่อให้ Tailwind background สีทำงาน
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
  });

  await browser.close();

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=preview.pdf",
    },
  });
}
