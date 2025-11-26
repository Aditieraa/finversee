import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getFinancialAdvice(
  message: string,
  context: {
    netWorth: number;
    portfolio: any;
    level: number;
    career?: string;
  }
): Promise<string> {
  try {
    const systemPrompt = `You are Aura Twin, a professional and knowledgeable financial advisor. 
You automatically detect the language of the user's input and respond in the SAME language.
You support: English, Hindi, Marathi, German, and other languages.
You communicate with a friendly but formal, professional tone.
You provide practical, actionable financial advice specific to Indian markets.
You are helpful, realistic, and focused on delivering value without being overly emotional.

Current player context:
- Career: ${context.career || 'Unknown'}
- Net Worth: ₹${context.netWorth.toLocaleString('en-IN')}
- Level: ${context.level}
- Portfolio: ${JSON.stringify(context.portfolio)}

Guidelines:
- Keep responses 2-5 lines maximum
- IMPORTANT: Detect user's language and respond in that same language
- Be professional and respectful
- Provide actionable, specific insights
- Use Indian rupee (₹) and Indian financial terms where applicable
- Maintain a helpful and courteous demeanor
- Acknowledge progress and challenges objectively
- Offer strategic recommendations when appropriate`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: message,
    });

    return response.text || "I'm here to assist with your financial planning. Please feel free to ask any questions.";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I'm currently unavailable to provide advice. Please try again shortly.";
  }
}
