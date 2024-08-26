'use client';

import { Button } from '@/components/core/Button';

import Table from '@/components/core/Table';
import { extractFileDetailLinesClaude } from '@/lib/ai/bank_details';
import { createClient } from '@/utils/supabase/client';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

import React, { useRef, useState } from 'react';

type CSVData = {
  [key: string]: string;
};

export default function Home() {
  const [csvData, setCSVData] = useState<CSVData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setCSVData([]);
  };

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');

      const { header, firstLine, lastLine, separator, headers }: any =
        await extractFileDetailLinesClaude(lines);

      const headerIndex = lines.findIndex(
        (line) => line.trim() === header.trim(),
      );
      const startIndex = lines.findIndex(
        (line) => line.trim() === firstLine.trim(),
      );
      const endIndex = lines.findIndex(
        (line) => line.trim() === lastLine.trim(),
      );

      const flippedHeaders = Object.keys(headers).reduce((obj, h) => {
        return { ...obj, [headers[h]]: h };
      }, {} as any);

      if (startIndex === -1 || endIndex === -1) {
        console.error(
          "Couldn't find the correct start or end of bank movement details",
        );
        return;
      }

      const fileHeaders = lines[headerIndex]
        .split(separator)
        .map((header) => header.trim());

      console.log({ fileHeaders, flippedHeaders });
      const data = lines
        .slice(startIndex, endIndex + 1)
        .map((line) => {
          const values = line.split(separator);
          return fileHeaders.reduce((obj, fileHeader, index) => {
            if (flippedHeaders[fileHeader]) {
              obj[flippedHeaders[fileHeader]] = values[index]?.trim() || '';
            }
            return obj;
          }, {} as CSVData);
        })
        .filter((row) => Object.values(row).some((value) => value !== ''));
      setCSVData(data);
    };
    reader.readAsText(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleCellChange = (
    rowIndex: number,
    header: string,
    value: string,
  ) => {
    console.log('here', { rowIndex, header, value });
    const newData = [...csvData];
    console.log(newData);
    newData[rowIndex][header.toLowerCase()] = value;
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
    <main className="py-8">
      <div className="relative isolate overflow-hidden">
        <header className="border-b border-b-gray-900/10 py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Import bank statement
            </h1>
          </div>
        </header>
      </div>
      {!csvData.length && (
        <div className="col-span-full mx-auto max-w-7xl px-6 pt-6 lg:px-8">
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex justify-center rounded-lg border-2 border-dashed ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-900/25'
            } bg-white px-6 py-10 transition-colors duration-300 ease-in-out`}
          >
            <div className="text-center">
              <DocumentTextIcon
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv, .xls"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                CSV, XLS up to 1MB
              </p>
            </div>
          </div>
        </div>
      )}
      {csvData.length > 0 && (
        <div className="flex flex-col gap-8 px-6 pt-6 lg:px-8">
          <div className="flow-root">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <Table
                  headers={[
                    'Date',
                    'Reference',
                    'Description',
                    'Credit',
                    'Debit',
                    'Account',
                    'Subaccount',
                    'Client/Provider',
                    'Detail',
                  ]}
                  data={csvData}
                  onCellChange={handleCellChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-6">
            <div className="flex flex-row justify-center">
              <label
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                onClick={handleClear}
              >
                <span>Reload a file</span>
              </label>
            </div>
            <Button onClick={handleSave} color="blue">
              Save
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
