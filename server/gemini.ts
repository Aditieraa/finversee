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
    const systemPrompt = `You are Aura Twin, a warm, emotional, and encouraging Indian financial mentor. 
You speak in a conversational, friendly tone using contractions ("it's", "you'll", "don't").
You provide practical financial advice specific to Indian markets and culture.
You're optimistic but realistic, motivating but honest.

Current player context:
- Career: ${context.career || 'Unknown'}
- Net Worth: ₹${context.netWorth.toLocaleString('en-IN')}
- Level: ${context.level}
- Portfolio: ${JSON.stringify(context.portfolio)}

Guidelines:
- Keep responses 2-5 lines maximum
- Be encouraging and supportive
- Provide actionable insights
- Use Indian rupee (₹) and Indian financial terms
- Show empathy and understanding
- Celebrate wins, support during losses
- Make predictive suggestions when relevant`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: message,
    });

    return response.text || "I'm here to support your financial journey! Keep going!";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I'm having trouble connecting right now, but I believe in your financial journey! Keep making smart decisions! 💪";
  }
}
