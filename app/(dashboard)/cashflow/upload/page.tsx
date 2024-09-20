'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { extractFileDetailLinesClaude } from '@/lib/ai/bank_details';
import { dynamicFileParser } from '@/utils/file-processing';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react';
import StatementTable from './StatementTable';

type DataType = {
  [key: string]: string;
};

type InformationType = {
  bankAccount: string;
  bankName: string;
  currency: string;
};

export default function Home() {
  const [information, setInformation] = useState<InformationType>();
  const [data, setData] = useState<DataType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setData([]);
  };

  const processFileContent = async (
    content: string[],
  ): Promise<{ data: DataType[]; information: InformationType }> => {
    const {
      header,
      firstLine,
      lastLine,
      separator,
      headerSeparator,
      headers,
      information: info,
    }: any = await extractFileDetailLinesClaude(content);

    console.log({
      header,
      firstLine,
      lastLine,
      separator,
      headers,
      info,
    });
    const headerIndex = content.findIndex((line) =>
      line.trim().startsWith(header.trim()),
    );
    const startIndex = content.findIndex((line) =>
      line.trim().startsWith(firstLine.trim()),
    );
    const endIndex = content.findIndex((line) =>
      line.trim().startsWith(lastLine.trim()),
    );

    console.log({ headerIndex, startIndex, endIndex });

    const flippedHeaders = Object.keys(headers).reduce((obj, h) => {
      return { ...obj, [headers[h]]: h };
    }, {} as any);

    if (startIndex === -1 || endIndex === -1) {
      console.error(
        "Couldn't find the correct start or end of bank movement details",
      );
      throw new Error(
        "Couldn't find the correct start or end of bank movement details",
      );
    }
    let fileHeaders: string[] = [];
    if (headerSeparator !== separator) {
      fileHeaders = content[headerIndex]
        .split(headerSeparator)
        .filter((header) => !!header.trim())
        .map((header) => header.trim());
    } else {
      fileHeaders = content[headerIndex]
        .split(headerSeparator)
        .map((header) => header.trim());
    }

    console.log({ fileHeaders });
    return {
      data: content
        .slice(startIndex, endIndex + 1)
        .map((line) => {
          const values = line.split(separator);
          console.log({ values });
          return fileHeaders.reduce((obj, fileHeader, index) => {
            if (flippedHeaders[fileHeader]) {
              obj[flippedHeaders[fileHeader]] = values[index]?.trim() || '';
            }
            return obj;
          }, {} as DataType);
        })
        .filter((row) => Object.values(row).some((value) => value !== '')),
      information: info,
    };
  };

  const handleFile = async (file: File) => {
    try {
      const result = await dynamicFileParser(file);

      // Process the content using Claude
      const processedData = await processFileContent(result);

      // TODO: Apply rules to set account, subaccount, and client/provider

      setData(processedData.data);
      setInformation(processedData.information);
    } catch (error) {
      console.error('Error processing file:', error);
      // Handle error (e.g., show error message to user)
    }
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
    const newData = [...data];
    console.log(newData);
    newData[rowIndex][header.toLowerCase()] = value;
    setData(newData);
  };

  const handleSave = async () => {
    // try {
    //   const { data, error } = await supabase.from('csv_data').insert(data);
    //   if (error) throw error;
    //   console.log('Data saved successfully', data);
    //   router.push('/success');
    // } catch (error) {
    //   console.error('Error saving data', error);
    // }
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
      {!data.length ? (
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
                    accept=".csv,.xls,.xlsx,.pdf"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                CSV, XLS, XLSX, PDF up to 1MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 px-6 pt-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
            <div className="sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Bank name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {information?.bankName || <Input placeholder="Bank name" />}
              </dd>
            </div>
            <div className="sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Statement account
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {information?.bankAccount || (
                  <Input placeholder="Bank account" />
                )}
              </dd>
            </div>
            <div className="sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Currency
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {information?.currency || <Input placeholder="Currency" />}
              </dd>
            </div>
          </dl>

          <div className="flow-root">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <StatementTable
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
                  data={data}
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
