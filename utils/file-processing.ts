import * as cheerio from 'cheerio';
import * as XLSX from 'xlsx';

function parseCsv(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      resolve(lines);
    };
    reader.readAsText(file);
  });
}

async function parseExcel(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const dataCSV = XLSX.utils.sheet_to_csv(sheet, {
    FS: ';',
    rawNumbers: false,
  });
  const lines = dataCSV.split('\n');
  console.log({ lines });
  return lines;
}

async function parseHtml(file: File): Promise<string[]> {
  const content = await file.text();
  const $ = cheerio.load(content);
  const result: string[] = [];

  // Parse account information
  $('table').each((_, table) => {
    $(table)
      .find('tr')
      .each((_, tr) => {
        const row: string[] = [];
        const td = $(tr).find('td');
        td.each((_, value) => {
          row.push($(value).text().trim());
        });
        result.push(row.join(';'));
      });
  });

  return result;
}

async function detectFileType(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (['xls', 'xlsx'].includes(extension || '')) {
    const content = await file.text();
    if (content.includes('<table')) {
      return 'html';
    }
    return 'excel';
  } else if (extension === 'csv') {
    return 'csv';
  } else if (extension === 'pdf') {
    return 'pdf';
  } else {
    throw new Error('Unsupported file type');
  }
}

export async function dynamicFileParser(file: File): Promise<string[]> {
  const fileType = await detectFileType(file);

  console.log({ fileType });
  switch (fileType) {
    case 'excel':
      return parseExcel(file);
    case 'csv':
      return parseCsv(file);
    case 'html':
      return parseHtml(file);
    default:
      throw new Error('Unsupported file type');
  }
}
