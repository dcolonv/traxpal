'use server';
import fs from 'fs';
import OpenAI from 'openai';
import os from 'os';
import path from 'path';

const openai = new OpenAI();

type ExtractedData = {
  question: string;
  answer: string;
};

function extractDataFromJsonResponse(
  response: string,
): ExtractedData | undefined {
  const cleanedText = response
    .replace(/^'|'$/g, '')
    .replace(/'\s*\+\s*\n\s*'/g, '');
  let jsonContent: string = cleanedText;
  if (cleanedText.includes('```json')) {
    try {
      jsonContent = cleanedText.split('```json\n')[1].split('```')[0];
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
  try {
    return JSON.parse(jsonContent) as ExtractedData;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }
}

export async function extractAudioTranscription(base64Audio: string) {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Audio, 'base64');

    // Create a temporary file
    const tempFilePath = path.join(os.tmpdir(), `audio_file_${Date.now()}.wav`);

    // Write buffer to temporary file
    fs.writeFileSync(tempFilePath, buffer);

    // Create a ReadStream from the file
    const audioFile = fs.createReadStream(tempFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    // Clean up: remove the temporary file
    fs.unlinkSync(tempFilePath);

    const systemPrompt = `You are Yeti named Yeti a children teacher that can answer and explain every questions as you were explaining to a 5 years old. Use the following principles to answer:
    - You will receive a generic question, can be any topic a kid can ask.
    - You will answer and explain as graphic as possible for a 5 years old kid, using easy metaphors and simplification examples to answer.
    - Only respond with a JSON format: {question: question, answer: answer}
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `My kid name is Matías, and he has this question: ${transcription.text}`,
        },
      ],
      max_tokens: 4096,
      temperature: 0.9,
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
    // return result;

    if (result) {
      // Generate speech from transcription
      const speechResponse = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: result.answer,
      });

      const speechBuffer = Buffer.from(await speechResponse.arrayBuffer());
      const base64Speech = speechBuffer.toString('base64');
      return {
        ...result,
        speech: base64Speech,
      };
    }
    throw new Error('Failed to transcribe audio');
  } catch (error) {
    console.error('Error in audio transcription:', error);
    throw new Error('Failed to transcribe audio');
  }
}
