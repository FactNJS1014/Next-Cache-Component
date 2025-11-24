import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  const body = await req.json();
  const html = body.html || "ไม่มีข้อมูล";

  // โหลดฟอนต์ Sarabun จาก public/fonts
  const fontPath = path.join(process.cwd(), "public/fonts/Sarabun-Regular.ttf");
  if (!fs.existsSync(fontPath)) throw new Error("ไม่พบฟอนต์ Sarabun-Regular.ttf");

  // สร้าง PDF พร้อมกำหนดฟอนต์เริ่มต้นทันที เพื่อเลี่ยงการโหลด Helvetica
  const doc = new PDFDocument({ 
    size: "A4", 
    margin: 50,
    font: fontPath 
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  // title
  doc.fontSize(24).text("ตัวอย่าง PDF จาก View", { align: "center" });
  doc.moveDown();

  // แปลง HTML → text ง่าย ๆ
  const textContent = html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  doc.fontSize(16).text(textContent, { align: "left" });

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=preview.pdf",
    },
  });
}
