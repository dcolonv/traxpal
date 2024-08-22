'use client';

import { Button } from '@/components/core/Button';

import Table from '@/components/core/Table';
import { extractFileDetailLinesClaude } from '@/lib/ai/bank_details';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

type CSVData = {
  [key: string]: string;
};

export default function Home() {
  const [csvData, setCSVData] = useState<CSVData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        console.log(lines);

        // Find the index of "Detalle de Estado Bancario" and "Resumen de Estado Bancario"
        const { header, firstLine, lastLine, separator }: any =
          await extractFileDetailLinesClaude(lines);

        console.log({ header, firstLine, lastLine, separator });

        // Find the index of "Detalle de Estado Bancario" and "Resumen de Estado Bancario"
        const headerIndex = lines.findIndex(
          (line) => line.trim() === header.trim(),
        );
        const startIndex = lines.findIndex(
          (line) => line.trim() === firstLine.trim(),
        );
        const endIndex = lines.findIndex(
          (line) => line.trim() === lastLine.trim(),
        );

        if (startIndex === -1 || endIndex === -1) {
          console.error(
            "Couldn't find the correct start or end of bank movement details",
          );
          return;
        }

        // Extract headers and data
        const headers = lines[headerIndex]
          .split(separator)
          .map((header) => header.trim());
        const data = lines
          .slice(startIndex, endIndex + 1)
          .map((line) => {
            const values = line.split(separator);
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index]?.trim() || '';
              return obj;
            }, {} as CSVData);
          })
          .filter((row) => Object.values(row).some((value) => value !== '')); // Remove empty rows

        setHeaders(headers);
        setCSVData(data);
      };
      reader.readAsText(file);
    }
  };

  const handleCellChange = (
    rowIndex: number,
    header: string,
    value: string,
  ) => {
    const newData = [...csvData];
    newData[rowIndex][header] = value;
    setCSVData(newData);
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase.from('csv_data').insert(csvData);
      if (error) throw error;
      console.log('Data saved successfully', data);
      router.push('/success');
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">CSV Upload and Display</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {csvData.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Table
              headers={headers}
              data={csvData}
              onCellChange={handleCellChange}
            />
          </div>
          <Button onClick={handleSave} className="mt-4">
            Save to Supabase
          </Button>
        </>
      )}
    </div>
  );
}
