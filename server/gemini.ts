import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not set! Aura Twin will not work.');
}

const ai = new GoogleGenAI({ apiKey });

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
    if (!apiKey) {
      console.error('❌ No GEMINI_API_KEY available');
      return "I'm having trouble connecting right now, but I'm here to support you! Keep making smart financial decisions. Your future self will thank you!";
    }

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

    console.log('📤 Sending to Gemini API:', { message, career: context.career, netWorth: context.netWorth });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const text = response.text;
    console.log('📥 Gemini response:', text);

    if (!text) {
      console.error('❌ Empty response from Gemini API');
      return "I'm here to assist with your financial planning. Please feel free to ask any questions.";
    }

    return text;
  } catch (error) {
    console.error('❌ Gemini API error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      apiKeyExists: !!apiKey,
    });
    return "I'm having trouble connecting right now, but I'm here to support you! Keep making smart financial decisions. Your future self will thank you!";
  }
}
