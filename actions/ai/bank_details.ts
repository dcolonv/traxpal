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

const systemPrompt = `You are a helpful assistant that can identify and extract bank transaction details from a text, Use the following principles to answer:
- You will receive an array of texts in csv format.
- Some amounts can be negative, so take into account the sign - in the amount as part of the information and nothing else.
- The content of each line is a csv format, the content can have generic bank account information, bank account transaction details, and summary.
- The bank transaction details should include date, transaction description, debit amount, credit amount, and balance, etc.
- Header line is the one with texts describing the subsecuent order of csv lines.

- You will return the header line
- You will return the first transaction detail line
- You will return the last transaction detail line
- You will return the separator used in the header it can be space, tab, "," or ";" or any other you find, separator are a single character.
- You will return the separator used in the text it can be space, tab, "," or ";" or any other you find, separator are a single character.
- You will return the texts of headers corresponding to Date, Reference or Document number, Description, Debit, and Credit
- You will return important information as currency of transactions, bank account number, bank name, etc, as possible
- Only respond with a JSON format: {header: headerLine, firstLine: first transaction, lastLine: last transaction line, headerSeparator: header separator character, separator: separator character used on the text lines, headers: {date: date header text, reference: reference or document number, description: description header text, debit: debit header text, credit: credit header text}, information: {currency: transactions currency, bankAccount: bank account, bankName: bank name}} and nothing else, avoid extra comments or explanation, I only want the json object to be parsed into a Javascript object.
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
    model: 'o1-mini',
    messages: [
      { role: 'system', content: systemPrompt },
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

  const result = await generateText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    temperature: 0.2,
    maxTokens: 8192,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
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

  return JSON.parse(result.text);
}
