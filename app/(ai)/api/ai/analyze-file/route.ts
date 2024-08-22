import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { fileContent } = res;

    const system = `You are a helpful assistant that can identify and extract bank transaction details from various file formats.
    - You will receive a file with different formats csv or xml and you will return the lines that contains the detail lines
    - You will only return the line numbers in array format like [startLine, endLine] and nothing else.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // You may need to adjust this to the appropriate Claude model
      messages: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: `Please analyze the following file content and let me know from what line number to what line number are the detail lines:\n\n${fileContent}`,
        },
      ],
    });

    const extractedLines = completion.choices[0].message?.content;

    console.log({ extractedLines });
    Response.json({ extractedLines });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return new Response('Error processing file', {
      status: 500,
    });
  }
}
