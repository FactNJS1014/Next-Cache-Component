"use client";

import { useEffect, useState } from "react";

type Breed = {
  id: string;
  attributes: {
    name: string;
    description: string;
    hypoallergenic: boolean;
    life: { min: number; max: number };
    male_weight: { min: number; max: number };
    female_weight: { min: number; max: number };
  };
};

export default function PdfContentPage() {
  const [breeds, setBreeds] = useState<Breed[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://dogapi.dog/api/v2/breeds");
      const json = await res.json();
      setBreeds(json.data);
    };
    fetchData();
  }, []);

  const generatePDF = async () => {
    if (breeds.length === 0) return alert("Data ยังโหลดไม่เสร็จ");

    // สร้าง HTML dynamic
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun&display=swap" rel="stylesheet">
          <style>body { font-family: 'Sarabun', sans-serif; padding: 20px; }</style>
        </head>
        <body>
          <h1 class="text-3xl font-bold mb-6">Dog Breeds Report</h1>
          <div class="flex flex-col gap-4">
            ${breeds
              .map(
                (b) => `
              <div class="p-4 border rounded shadow-sm flex flex-col gap-2 break-inside-avoid">
                <h2 class="text-2xl font-semibold">${b.attributes.name}</h2>
                <p>${b.attributes.description}</p>
                <p>Hypoallergenic: ${
                  b.attributes.hypoallergenic ? "Yes" : "No"
                }</p>
                <p>Life: ${b.attributes.life.min} - ${
                  b.attributes.life.max
                } years</p>
                <p>Male Weight: ${b.attributes.male_weight.min} - ${
                  b.attributes.male_weight.max
                } kg</p>
                <p>Female Weight: ${b.attributes.female_weight.min} - ${
                  b.attributes.female_weight.max
                } kg</p>
              </div>
            `
              )
              .join("")}
          </div>
        </body>
      </html>
    `;

    const res = await fetch("/api/pdf/html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="p-6">
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        สร้าง PDF รายงาน Dog Breeds
      </button>
    </div>
  );
}
