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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // โหลด List ทั้งหมด
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://dogapi.dog/api/v2/breeds");
      const json = await res.json();
      setBreeds(json.data);
    };
    fetchData();
  }, []);

  const generatePDF = async (id: string) => {
    // ถ้ากดที่แถวเดิม → toggle ปิด/เปิด
    if (pdfUrl && currentId === id) {
      setShowPdf(!showPdf);
      return;
    }

    // โหลดข้อมูล breed ตัวเดียว
    const resBreed = await fetch("https://dogapi.dog/api/v2/breeds/" + id);
    const jsonBreed = await resBreed.json();
    const b: Breed = jsonBreed.data;

    // HTML เฉพาะตัวที่เลือก
    const html = `
      <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Sarabun', sans-serif; padding: 20px; }
          .avoid-break { break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1 class="text-2xl font-semibold mb-6">Dog Breeds Report</h1>

        <div class="p-4 border rounded shadow-sm flex flex-col gap-2 avoid-break">
          <h2 class="text-2xl font-semibold">${b.attributes.name}</h2>
          <p>${b.attributes.description}</p>
          <p>Hypoallergenic: ${b.attributes.hypoallergenic ? "Yes" : "No"}</p>
          <p>Life: ${b.attributes.life.min} - ${b.attributes.life.max} years</p>
          <p>Male Weight: ${b.attributes.male_weight.min} - ${
      b.attributes.male_weight.max
    } kg</p>
          <p>Female Weight: ${b.attributes.female_weight.min} - ${
      b.attributes.female_weight.max
    } kg</p>
        </div>
      </body>
      </html>
    `;

    // ส่งไป PDF route
    const pdfRes = await fetch("/api/pdf/html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    const blob = await pdfRes.blob();
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setCurrentId(id);
    setShowPdf(true);
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <table className="border-collapse border border-gray-500 p-2 rounded ">
        <thead>
          <tr>
            <th>breed</th>
            <th>description</th>
            <th>hypoallergenic</th>
            <th>life</th>
            <th>male_weight</th>
            <th>female_weight</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {breeds.map((b) => (
            <tr key={b.id}>
              <td>{b.attributes.name}</td>
              <td>{b.attributes.description}</td>
              <td>{b.attributes.hypoallergenic ? "Yes" : "No"}</td>
              <td>
                {b.attributes.life.min} - {b.attributes.life.max} years
              </td>
              <td>
                {b.attributes.male_weight.min} - {b.attributes.male_weight.max}{" "}
                kg
              </td>
              <td>
                {b.attributes.female_weight.min} -{" "}
                {b.attributes.female_weight.max} kg
              </td>
              <td>
                <button
                  onClick={() => generatePDF(b.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {showPdf && currentId === b.id ? "ปิด PDF" : "ดู PDF"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPdf && pdfUrl && (
        <iframe src={pdfUrl} className="w-full h-[800px] border rounded" />
      )}
    </div>
  );
}
