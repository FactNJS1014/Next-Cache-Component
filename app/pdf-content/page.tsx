"use client";

import { useState } from "react";

export default function PdfContentPage() {
  const [html, setHtml] = useState(`
    <h1>รายงานข้อมูล</h1>
    <p>ภาษาไทยทำงานได้ปกติ</p>
    <p>English text is also supported.</p>
  `);

  const openPDF = async () => {
    const res = await fetch("/api/pdf/html", {
      method: "POST",
      body: JSON.stringify({ html }),
      headers: { "Content-Type": "application/json" },
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank"); // เปิด PDF inline viewer
  };

  return (
    <div className="p-6">
      <h1 className="mb-2 text-xl font-bold">สร้างเนื้อหา PDF</h1>

      <textarea
        className="border p-2 w-full h-56"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
      />

      <button
        onClick={openPDF}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        แสดง PDF
      </button>
    </div>
  );
}
