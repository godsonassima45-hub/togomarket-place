
import { GoogleGenAI, Type, Modality, LiveServerMessage, Blob } from "@google/genai";

export class GeminiService {
  private static get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // --- Audio Utils for Live API ---
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

  // --- Core Services ---
  static async analyzeProfile(userData: any, type: 'seller' | 'buyer'): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tu es Lumina Intelligence. Analyse ce profil ${type} : ${JSON.stringify(userData)}. Donne un rapport Facebook-style : Authenticité, Sentiment, Influence et Risque.`
      });
      return response.text || "Analyse impossible.";
    } catch (e) {
      return "Erreur d'analyse.";
    }
  }

  static async getStylistAdvice(userQuery: string, catalog: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Tu es l'expert mode de TogoMarket. En utilisant les tendances actuelles du web et notre catalogue : ${catalog}, réponds à : ${userQuery}. Cite tes sources si tu utilises des tendances externes.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      let text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        text += "\n\n**Sources & Tendances :**\n";
        chunks.forEach((chunk: any) => {
          if (chunk.web) text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
        });
      }
      return text;
    } catch (e) {
      return "Désolé, le styliste est occupé.";
    }
  }

  static async getRecommendations(history: string[], catalog: string): Promise<string[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyse l'historique : [${history.join(', ')}] et le catalogue : ${catalog}. Retourne un JSON array des 5 meilleurs IDs produits.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (e) {
      return [];
    }
  }

  static async getSmartSuggestions(imgBase64: string): Promise<string[]> {
    try {
      const data = imgBase64.includes(',') ? imgBase64.split(',')[1] : imgBase64;
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data, mimeType: 'image/jpeg' } },
            { text: "Suggère 4 prompts pour changer l'arrière-plan de ce produit." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (e) { return []; }
  }

  static async replaceBackground(productImg: string, bgImg: string): Promise<string | null> {
    try {
      const pData = productImg.includes(',') ? productImg.split(',')[1] : productImg;
      const bData = bgImg.includes(',') ? bgImg.split(',')[1] : bgImg;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: pData, mimeType: 'image/jpeg' } },
            { inlineData: { data: bData, mimeType: 'image/jpeg' } },
            { text: "Intègre l'objet de la première image dans le décor de la deuxième." }
          ]
        }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part ? `data:image/png;base64,${part.inlineData.data}` : null;
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
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  }

  static async virtualTryOn(userImg: string, productDesc: string): Promise<string | null> {
    try {
      const data = userImg.includes(',') ? userImg.split(',')[1] : userImg;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data, mimeType: 'image/jpeg' } },
            { text: `Fais porter cet article de mode : ${productDesc}` }
          ]
        }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  }

  static async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  }

  static connectLiveStylist(callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onerror: (e: ErrorEvent) => void;
    onclose: (e: CloseEvent) => void;
  }) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: 'Tu es Lumina, l\'assistant vocal expert de TogoMarket. Tu aides les clients à trouver des produits en parlant naturellement. Sois poli, concis et efficace.',
      },
    });
  }
}
