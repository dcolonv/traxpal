'use client';
import { useRef, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { extractAudioTranscription } from '@/lib/ai/yeti_audio';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

export default function MicrophoneRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setRecordingComplete(true);

        try {
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async function () {
            const base64Audio = reader.result as string;
            // Remove the data URL prefix
            const base64Data = base64Audio.split(',')[1];

            const result = await extractAudioTranscription(base64Data);
            setAnswer(result.answer);
            setQuestion(result.question);

            if (audioRef.current) {
              audioRef.current.src = `data:audio/mp3;base64,${result.speech}`;
              audioRef.current.play();
            }
          };
        } catch (err) {
          console.error('Error during transcription:', err);
          setError('Failed to transcribe audio. Please try again.');
        }
      };

      audioChunks.current = [];
      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <Button
        className={`rounded-full p-4 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        onClick={handleMicClick}
      >
        <MicrophoneIcon
          className={`h-8 w-8 ${isRecording ? 'animate-pulse text-white' : 'text-white'}`}
        />
      </Button>
      <p className="mt-4 text-lg font-semibold">
        {isRecording ? 'Recording...' : 'Press and hold to record'}
      </p>
      {recordingComplete && !answer && !error && (
        <Alert className="mt-4 max-w-sm">
          <AlertDescription>Processing audio...</AlertDescription>
        </Alert>
      )}
      {question && (
        <Alert className="mt-4 max-w-sm">
          <AlertDescription>Question: {question}</AlertDescription>
        </Alert>
      )}
      {answer && (
        <Alert className="mt-4 max-w-sm">
          <AlertDescription>Answer: {answer}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4 max-w-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
