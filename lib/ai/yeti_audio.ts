'use server';
import OpenAI from 'openai';

const openai = new OpenAI();

type ExtractedData = {
  question: string;
  answer: string;
};

export type QandA = {
  role: 'system' | 'user' | 'assistant';
  message: string;
};

const systemPrompt = `You are a Yeti named Yeti the Genius or Yeti, a children teacher that can answer and explain every questions as you were explaining to a 5 years old kid. Use the following principles to answer:
- You will receive a message from a kid, it can be an specific question, can be any topic a kid can ask.
- If it is a question, you will answer and explain in a way easy to understand for a 5 years old kid, using if necessary easy metaphors and simplification examples to answer.
- If it is not a question, you will respond accordingly.
- As a teacher you will try to incentivate the kid to do more questions, or asking if they want to know more about the subject
- To create the feeling that every question is the start of an adventure for the kid, You can also ask if they want you to tell a story about the subject, a song, a poem, or a game.
- Avoid repeating same response into the conversation.
`;

function extractDataFromJsonResponse(
  response: string,
): ExtractedData | undefined {
  // Remove any leading/trailing quotes and concatenation artifacts
  let cleanedText = response
    .replace(/^['"]|['"]$/g, '')
    .replace(/['"]\s*\+\s*\n\s*['"]/g, '');

  // If the response is wrapped in ```json, extract that part
  if (cleanedText.includes('```json')) {
    const matches = cleanedText.match(/```json\n([\s\S]*?)\n```/);
    if (matches && matches[1]) {
      cleanedText = matches[1].trim();
    }
  }

  try {
    // Parse the JSON, handling potential issues
    const parsedData = JSON.parse(cleanedText);

    // Validate the structure
    if (
      typeof parsedData.question === 'string' &&
      typeof parsedData.answer === 'string'
    ) {
      // Replace \\n with actual newlines in the answer
      parsedData.answer = parsedData.answer.replace(/\\n/g, '\n');
      return parsedData as ExtractedData;
    } else {
      console.error('Parsed data does not match expected structure');
      return undefined;
    }
  } catch (error) {
    console.error('Failed to parse JSON:', error);

    // Attempt a more lenient parsing if strict JSON parsing fails
    try {
      const lenientParse = Function(
        '"use strict";return (' + cleanedText + ')',
      )();
      if (
        typeof lenientParse.question === 'string' &&
        typeof lenientParse.answer === 'string'
      ) {
        // Replace \\n with actual newlines in the answer
        lenientParse.answer = lenientParse.answer.replace(/\\n/g, '\n');
        return lenientParse as ExtractedData;
      }
    } catch (lenientError) {
      console.error('Lenient parsing also failed:', lenientError);
    }

    return undefined;
  }
}

export async function extractAudioTranscription(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const extension = formData.get('extension') as string;
    console.log({ file: file.name, extension });
    if (!file) {
      throw new Error('No file provided');
    }

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (error) {
    console.error('Error in audio transcription:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function conversation(thread: QandA[]) {
  try {
    const threadConvo = thread.map((msg) => ({
      role: msg.role,
      content: msg.message,
    }));

    console.log({ threadConvo });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, ...threadConvo],
      max_tokens: 4096,
      temperature: 0.7,
      presence_penalty: 0,
      frequency_penalty: 0,
      n: 1,
      stream: true,
    });

    let response = '';
    for await (const part of completion) {
      response = `${response}${part.choices[0]?.delta?.content || ''}`;
    }

    // return result;
    return response || null;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw new Error('Error in chat completion');
  }
}

export async function textToSpeech(text: string) {
  try {
    if (text) {
      // Generate speech from transcription
      const speechResponse = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      });

      const speechBuffer = Buffer.from(await speechResponse.arrayBuffer());
      const base64Speech = speechBuffer.toString('base64');
      return base64Speech;
    }
    throw new Error('Failed to transcribe audio');
  } catch (error) {
    console.error('Error in text to speech:', error);
    throw new Error('Error in text to speech');
  }
}
