'use client';

import { processBankStatementFileContent } from '@/actions/server/bank_statements';
import {
  StatementInformationType,
  StatementTransactionType,
} from '@/lib/types/statements';
import { dynamicFileParser } from '@/utils/file-processing';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

interface InputUploadFileProps {
  onProcessFile: (props: {
    bankTransactions: StatementTransactionType[];
    information: StatementInformationType;
  }) => void;
}

export default function InputUploadFile({
  onProcessFile,
}: InputUploadFileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      const result = await dynamicFileParser(file);

      // Process the content using Claude
      const { bank_transactions, information } =
        await processBankStatementFileContent(result);
      onProcessFile({ bankTransactions: bank_transactions, information });
    } catch (error) {
      console.error('Error processing file:', error);
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

  return (
    <div className="-mx-8 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
      </div>
    </div>
  );
}
