'use server';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import OpenAI from 'openai';
const openai = new OpenAI();

interface ExtractedData {
  header: number;
  details: number[];
  headerLine: string;
}

const exampleCSVContent = `N˙mero de Clientes, Nombre, Producto, Moneda, Saldo Inicial, Saldo en Libros, Retenidos y Diferidos, Saldo Disponible, Fecha, STBGAV, STBUNC, Mensaje1, Mensaje2, Mensaje3, Mensaje4, Mensaje5, Mensaje6 
1374679, DAVID COLON VARGAS, CR32010200009084808583, USD, 1158.02, 12.39, 0.00, 12.39, 31/07/2024, 615.13, 0.00, , , , Con BAC Objetivos podÈs ahorrar para lo que te, propong·s. Vos ponÈs tus objetivos y nosotros te, ayudamos a alcanzarlos. 

Detalle de Estado Bancario
Fecha de TransacciÛn, Referencia de TransacciÛn, CÛdigo de TransacciÛn, DescripciÛn de TransacciÛn, DÈbito de TransacciÛn, CrÈdito de TransacciÛn, Balance de TransacciÛn 
01/03/2024, 22900000, CP, SUPER RINDE MAS SAMARA SRGUANA, 22.39, 0.00, 1135.63 
01/03/2024, 22800248, CP, SUPER Y LICORERA OMAEL        , 17.65, 0.00, 1117.98 
01/03/2024, 22900000, CP, Materiales de ConstruccioNicoy, 1.73, 0.00, 1116.25 

Resumen de Estado Bancario
CÛdigo TransacciÛn Totales , Cantidad DÈbitos Totales, Montos DÈbitos Totales, Cantidad CrÈditos Totales, Montos CrÈditos Totales 
CP, 75, 2675.15, 0, 0.00 
TF, 14, 17555.28, 18, 22934.46 
MD, 4, 1908.06, 0, 0.00 
DB, 4, 12.00, 0, 0.00 
`;

const systemPrompt = `You are a helpful assistant that can identify and extract bank transaction details from a text, Use the following principles to answer:
- You will receive a text in csv format, and you will return the headers line, and the transaction detail lines.
- Some amounts can be negative, so take into account the sign - in the amount as part of the information and nothing else.
- The content of each line is a csv format, the content can have generic bank account information, bank account transaction details, and summary.
- The bank transaction details should include date, transaction description, debit amount, credit amount, and balance, etc.
- Header line is the one with texts describing the subsecuent order of csv lines.
- Only respond with a JSON format: {header: headerLine, details: [detailline]} and nothing else, avoid extra comments or explanation, I only want the json object to be parsed into a Javascript object.
`;

const systemPrompt2 = `You are a helpful assistant that can identify and extract bank transaction details from a text, Use the following principles to answer:
- You will receive an array of texts in csv format.
- Some amounts can be negative, so take into account the sign - in the amount as part of the information and nothing else.
- The content of each line is a csv format, the content can have generic bank account information, bank account transaction details, and summary.
- The bank transaction details should include date, transaction description, debit amount, credit amount, and balance, etc.
- Header line is the one with texts describing the subsecuent order of csv lines.

- You will return the header line
- You will return the first transaction detail line
- You will return the last transaction detail line
- You will return the separator used in the text it can be , or ; or anyother you find.
- Only respond with a JSON format: {header: headerLine, firstLine: first transaction, lastLine: last transaction line, separator: separator used on the text lines} and nothing else, avoid extra comments or explanation, I only want the json object to be parsed into a Javascript object.
`;

function extractDataFromJsonResponse(response: string): ExtractedData | null {
  // Use a regular expression to find content within ```json and ```
  const match = response.match(/```json\s*([\s\S]*?)\s*```/);

  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1].trim());

      // Check if the parsed object has the expected structure
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof parsed.header === 'number' &&
        Array.isArray(parsed.details) &&
        parsed.details.every((item: any) => typeof item === 'number')
      ) {
        return {
          header: parsed.header,
          details: parsed.details,
          headerLine: parsed.headerLine,
        };
      }
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }

  // Return null if parsing fails or the result doesn't match the expected structure
  return null;
}

function extractArrayFromResponse(response: string): number[] {
  // Use a regular expression to find content within ```json and ```
  const match = response.match(/```json([\s\S]*?)```/);

  if (match && match[1]) {
    // Parse the extracted JSON string
    try {
      const parsed = JSON.parse(match[1].trim());
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === 'number')
      ) {
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }

  // Return an empty array if parsing fails or the result is not an array of numbers
  return [];
}

function stringToNumberArray(str: string): number[] {
  return JSON.parse(str.replace(/\s/g, ''));
}

export async function extractFileDetailLines(fileContent: string[]) {
  let prompt = `Can you analyze the information and extract the detail lines, and the header line of this array of strings: ${fileContent}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt2 },
      { role: 'user', content: prompt },
    ],
    max_tokens: 4096,
    temperature: 0.2,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  let response = '';
  for await (const part of completion) {
    response = `${response}${part.choices[0]?.delta?.content || ''}`;
  }

  console.log({ response });
  const result = extractDataFromJsonResponse(response);
  // const lines: number[] = extractArrayFromResponse(response);
  console.log({ result });
  return result;
}

export async function extractFileDetailLinesClaude(fileContent: string[]) {
  let prompt = `Can you analyze the information and extract the detail lines, and the header line of the array of texts: ${JSON.stringify(fileContent)}`;

  console.log(JSON.stringify(fileContent));
  const result = await generateText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    temperature: 0.2,
    maxTokens: 8192,
    messages: [
      {
        role: 'system',
        content: systemPrompt2,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  console.log(result.text);
  return JSON.parse(result.text);
}
