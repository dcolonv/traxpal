'use client';
import { createClient } from '@/utils/supabase/client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function FileUploadAndEdit() {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const supabase = createClient();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          if (file.name.endsWith('.csv')) {
            setFileContent(content);
          } else if (
            file.name.endsWith('.xls') ||
            file.name.endsWith('.xlsx')
          ) {
            const workbook = XLSX.read(content, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            setFileContent(csv);
          }
        }
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        reader.readAsBinaryString(file);
      }
    }
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFileContent(event.target.value);
  };

  const handleProcess = async () => {
    try {
      // Here you would typically send the fileContent to your backend for processing
      // For this example, we'll just log it and redirect
      console.log('Processing file content:', fileContent);

      // You can add your processing logic here
      // For example, sending to an API endpoint:
      // const response = await fetch('/api/processFile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: fileContent }),
      // });
      // const result = await response.json();

      // Redirect to a success page or the next step in your workflow
      // router.push('/success');
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">File Upload and Edit</h1>

      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={handleFileUpload}
        className="mb-4 rounded border border-gray-300 p-2"
      />

      {fileName && <p className="mb-2">Uploaded file: {fileName}</p>}

      <textarea
        value={fileContent}
        onChange={handleContentChange}
        className="mb-4 h-64 w-full rounded border border-gray-300 p-2"
        placeholder="File content will appear here. You can edit it before processing."
      />

      <button
        onClick={handleProcess}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Process File
      </button>
    </div>
  );
}
