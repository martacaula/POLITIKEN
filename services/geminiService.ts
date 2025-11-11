
import { GoogleGenAI, Modality } from "@google/genai";
import type { UserSettings, Article } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- UTILITY FUNCTIONS ---
// These are needed for concatenating audio chunks.

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

const getPrompt = (articlesText: string, settings: UserSettings, language: 'en' | 'da'): string => {
    if (language === 'da') {
        return `
            Funger som en professionel, selvsikker og rolig public radio-vært for 'Politiken Re:Connect'. Din tone skal være samtaleagtig, neutral, troværdig og journalistisk, med et klart tempo.

            Din opgave er at lave et manuskript til en ${settings.duration} minutters daglig nyhedspodcast. Manuskriptet skal følge denne struktur:

            1.  **Intro (10-15 sekunder):** Start med præcis denne intro: "Velkommen til Politiken Re:Connect — din daglige nyhedsbriefing."
            2.  **Segmenter (Krop):**
                - Opsummer artiklerne nedenfor.
                - Gruppér opsummeringerne efter kategori (f.eks. politik, økonomi, kultur).
                - Brug korte, naturlige sætninger.
                - Brug glidende overgange mellem emner (f.eks. "Lad os gå videre til...", "Og nu til...").
                - Indholdet skal være skræddersyet til aldersgruppen ${settings.ageGroup} med fokus på deres interesser i ${settings.interests.join(', ')}.
            3.  **Outro (10 sekunder):** Slut af med præcis denne outro: "Tak fordi du lyttede til Politiken Re:Connect — smarte nyheder for alle generationer."

            Det endelige manuskript skal være intelligent, men letforståeligt. Sørg for, at afsnit er adskilt af linjeskift til lydbehandling.

            Her er artiklerne, der skal opsummeres:
            ${articlesText}
        `;
    }

    // English prompt
    return `
        Act as a professional, confident, and calm public radio host for 'Politiken Re:Connect'. Your tone should be conversational, neutral, trustworthy, and journalistic, with clear pacing.

        Your task is to create a script for a ${settings.duration} minute daily news podcast. The script must follow this structure:

        1.  **Intro (10-15 seconds):** Start with this exact intro: "Welcome to Politiken Re:Connect — your daily news briefing."
        2.  **Segments (Body):**
            - Summarize the articles provided below.
            - Group the summaries by category (e.g., politics, economy, culture).
            - Use short, natural sentences.
            - Use smooth transitions between topics (e.g., "Let's move on to...", "And now for...").
            - The content must be tailored for the ${settings.ageGroup} age group, focusing on their interests in ${settings.interests.join(', ')}.
        3.  **Outro (10 seconds):** End with this exact outro: "Thank you for listening to Politiken Re:Connect — smart news for all generations."

        The final script should be intelligent yet approachable. Ensure paragraphs are separated by newlines for audio processing.

        Here are the articles to summarize:
        ${articlesText}
    `;
};


export const summarizeNews = async (articles: Article[], settings: UserSettings, language: 'en' | 'da'): Promise<string> => {
  const articlesText = articles.map(a => `Headline: ${a.headline}\nContent: ${a.content}`).join('\n\n---\n\n');

  const prompt = getPrompt(articlesText, settings, language);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

const generateSpeechChunk = async (text: string): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A clear, professional voice
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      console.warn("Audio data not found in Gemini response for chunk.");
      return "";
    }
    return audioData;
  } catch (error) {
    console.error("Error generating speech chunk:", error);
    return ""; // Fail gracefully for a single chunk
  }
};


export const generateSpeech = async (script: string): Promise<string> => {
  // 1. Split script into chunks by newline. Filter out empty or very short lines.
  const chunks = script.split('\n').filter(chunk => chunk.trim().length > 10);

  // 2. Generate audio for each chunk in parallel.
  const audioPromises = chunks.map(chunk => generateSpeechChunk(chunk));
  const base64Chunks = await Promise.all(audioPromises);
  
  // 3. Filter any failed chunks and decode the rest to byte arrays.
  const audioByteArrays = base64Chunks
    .filter(b64 => b64)
    .map(b64 => decode(b64));
  
  if (audioByteArrays.length === 0) {
      throw new Error("Failed to generate any audio data for the podcast.");
  }

  // 4. Concatenate the byte arrays into a single one.
  const totalLength = audioByteArrays.reduce((acc, arr) => acc + arr.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of audioByteArrays) {
      combined.set(arr, offset);
      offset += arr.length;
  }
  
  // 5. Re-encode the combined byte array to base64 and return.
  return encode(combined);
};