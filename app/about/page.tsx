"use client";

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/shadcn-io/combobox";
import { Input } from "@/components/ui/input";

interface Settings {
  SAG_SUBMATNUM: string;
}

export default function AboutPage() {
  const [data, setData] = useState<Settings[]>([]);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBase}/api/get/settings`);
        const json = await response.json();

        console.log("API DATA:", json);

        // ต้องอ่านจาก json.get_db
        if (Array.isArray(json.get_db)) {
          setData(json.get_db);
        } else {
          console.error("API response.get_db is not an array");
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [apiBase]);

  return (
    <div className="flex justify-center items-center h-full p-6">
      <Input placeholder="Search..." />
      <Combobox
        data={data}
        onOpenChange={(open) => console.log("Combobox is open?", open)}
        onValueChange={(newValue) => console.log("Combobox value:", newValue)}
        type="Submat"
      >
        <ComboboxTrigger className="w-70" />
        <ComboboxContent>
          <ComboboxInput />
          <ComboboxEmpty />
          <ComboboxList>
            <ComboboxGroup>
              {data.map((item) => (
                <ComboboxItem
                  key={item.SAG_SUBMATNUM}
                  value={item.SAG_SUBMATNUM}
                >
                  {item.SAG_SUBMATNUM}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
