
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

// --- ICONS ---
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MicrophoneActiveIcon: React.FC = () => (
    <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.8954 2 10 2.89543 10 4V12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2Z" fill="currentColor"/>
        <path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10H7V12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12V10H19Z" fill="currentColor"/>
    </svg>
);


// --- AUDIO UTILITIES ---
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// FIX: Implement a more performant audio encoding function.
function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


// --- COMPONENT ---
interface VoiceChatOverlayProps {
  onClose: () => void;
  podcastContext: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const VoiceChatOverlay: React.FC<VoiceChatOverlayProps> = ({ onClose, podcastContext }) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'error'>('connecting');
  const [transcript, setTranscript] = useState<{ user: string; model: string }[]>([]);

  const sessionPromiseRef = useRef<ReturnType<typeof ai.live.connect> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');


  useEffect(() => {
    let isMounted = true;

    const startSession = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser does not support the MediaDevices API.");
            }
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        if (!isMounted) return;
                        setStatus('listening');

                        const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
                        scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createPcmBlob(inputData);
                            sessionPromise.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
                        };
                        
                        source.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                         if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                            if (status !== 'speaking') setStatus('speaking');
                            
                            const audioB64 = message.serverContent.modelTurn.parts[0].inlineData.data;
                            const audioCtx = outputAudioContextRef.current!;
                            
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audioB64), audioCtx, 24000, 1);
                            const source = audioCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioCtx.destination);
                            
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                           for (const source of sourcesRef.current.values()) {
                                source.stop();
                                sourcesRef.current.delete(source);
                            }
                            nextStartTimeRef.current = 0;
                        }

                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                         if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }

                        if(message.serverContent?.turnComplete) {
                            setTranscript(prev => [...prev, { user: currentInputTranscriptionRef.current, model: currentOutputTranscriptionRef.current }]);
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                            setStatus('listening');
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error', e);
                        if (isMounted) setStatus('error');
                    },
                    onclose: () => {
                        console.log('Session closed');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are a helpful assistant for Politiken Re:Connect. The user is currently listening to a podcast with the following script: "${podcastContext}". Answer their questions based on this context, providing more detail where possible. Be concise and conversational. Speak Danish.`,
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (error) {
            console.error("Failed to start voice session:", error);
            if (isMounted) setStatus('error');
        }
    };
    startSession();

    return () => {
      isMounted = false;
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
      }
      inputAudioContextRef.current?.close();
      outputAudioContextRef.current?.close();
      sessionPromiseRef.current?.then(session => session.close());
      sourcesRef.current.forEach(source => source.stop());
    };
  }, [podcastContext]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors z-10">
          <CloseIcon />
        </button>
        
        <div className="p-6 border-b">
            <h2 className="font-serif text-2xl font-bold">Voice Assistant</h2>
            <p className="text-gray-600">Ask for more details about the news.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {transcript.map((turn, index) => (
                <div key={index}>
                    <p className="text-right"><span className="bg-politiken-red text-white rounded-lg px-3 py-2 inline-block">{turn.user}</span></p>
                    <p className="mt-2"><span className="bg-gray-200 text-politiken-charcoal rounded-lg px-3 py-2 inline-block">{turn.model}</span></p>
                </div>
            ))}
        </div>

        <div className="p-6 border-t flex flex-col items-center justify-center">
            <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-colors ${status === 'listening' || status === 'speaking' ? 'bg-politiken-red' : 'bg-gray-300'}`}>
               {status === 'listening' && <div className="h-10 w-10 text-white animate-pulse"><MicrophoneActiveIcon/></div>}
               {status === 'speaking' && <div className="h-10 w-10 text-white"><VolumeIcon/></div>}
               {status === 'connecting' && <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>}
            </div>
             <p className="mt-4 text-sm text-gray-500 font-medium tracking-wide uppercase">
                {status === 'connecting' && 'Connecting...'}
                {status === 'listening' && 'Listening...'}
                {status === 'speaking' && 'Speaking...'}
                {status === 'error' && 'Connection Error'}
            </p>
        </div>
      </div>
    </div>
  );
};

const VolumeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.5 4.5 4.5-4.5m-4.5 4.5V3" />
    </svg>
);
