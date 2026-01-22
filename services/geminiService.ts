
import { GoogleGenAI, Type, Modality, LiveServerMessage, Blob } from "@google/genai";

export class GeminiService {
  // Use a static getter to ensure a fresh instance with the current API key is always used
  private static get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  // --- Audio Utils ---
  static encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  static decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  static async decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
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

  static createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: this.encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  // --- IA Services ---
  static async analyzeProfile(userData: any, type: 'seller' | 'buyer'): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tu es Lumina IQ. Analyse ce profil ${type} : ${JSON.stringify(userData)}. Donne un rapport concis en français.`
      });
      return response.text || "Analyse indisponible.";
    } catch (e) {
      return "Erreur d'analyse.";
    }
  }

  static async getStylistAdvice(userQuery: string, catalog: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tu es Lumina IQ, l'assistant mode de TogoMarket. Catalogue : ${catalog}. Réponds à : ${userQuery}.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      let text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        text += "\n\n**Sources web :**\n";
        chunks.forEach((chunk: any) => {
          if (chunk.web) text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
        });
      }
      return text;
    } catch (e) {
      return "Désolé, Lumina Stylist est hors ligne.";
    }
  }

  static async virtualTryOn(userImgBase64: string, productInfo: string): Promise<string | null> {
    try {
      const data = userImgBase64.includes(',') ? userImgBase64.split(',')[1] : userImgBase64;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data, mimeType: 'image/jpeg' } },
            { text: `Génère une image réaliste de cette personne portant/utilisant cet article : ${productInfo}. Conserve le visage intact.` }
          ]
        }
      });
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts;
      const part = parts?.find(p => p.inlineData);
      return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  }

  static async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] }
      });
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts;
      const part = parts?.find(p => p.inlineData);
      return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  }

  static async getSmartSuggestions(imgBase64: string): Promise<string[]> {
    try {
      const data = imgBase64.includes(',') ? imgBase64.split(',')[1] : imgBase64;
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: data, mimeType: 'image/jpeg' } },
            { text: "Analyse cette image de produit et propose 4 suggestions d'améliorations visuelles ou de mises en scène créatives (en français). Réponds en JSON." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Suggestions error:", e);
      return [];
    }
  }

  static async replaceBackground(userImgBase64: string, bgImgBase64: string): Promise<string | null> {
    try {
      const userData = userImgBase64.includes(',') ? userImgBase64.split(',')[1] : userImgBase64;
      const bgData = bgImgBase64.includes(',') ? bgImgBase64.split(',')[1] : bgImgBase64;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: userData, mimeType: 'image/jpeg' } },
            { inlineData: { data: bgData, mimeType: 'image/jpeg' } },
            { text: "Remplace l'arrière-plan de la première image par le décor de la deuxième image. Conserve le sujet principal intact." }
          ]
        }
      });
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts;
      const part = parts?.find(p => p.inlineData);
      return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  }

  static async editImage(imgBase64: string, prompt: string): Promise<string | null> {
    try {
      const data = imgBase64.includes(',') ? imgBase64.split(',')[1] : imgBase64;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        }
      });
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts;
      const part = parts?.find(p => p.inlineData);
      return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  }

  static connectLiveStylist(callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
  }) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: 'Tu es Lumina, l\'assistant vocal expert de TogoMarket. Parle français, sois amical.',
      },
    });
  }
}
