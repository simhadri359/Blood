import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Use a singleton pattern with lazy initialization
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  // Only initialize if it hasn't been already and the API key exists
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({ apiKey });
    }
  }
  return ai;
}

export const generateEventDescription = async (theme: string): Promise<string> => {
  const aiClient = getAiClient();

  // Gracefully handle the missing API key case
  if (!aiClient) {
    console.warn("Gemini API key is not configured. Returning a mock description.");
    return `A fun and engaging community blood drive with a "${theme}" theme. Come join us to save lives! Your contribution is vital.`;
  }

  try {
    const prompt = `Generate a creative and engaging description for a blood donation drive with the theme: "${theme}". The description should be short (2-3 sentences), inspiring, and encourage people to participate. Do not include placeholders for date or location.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating event description with Gemini:", error);
    // Return a user-friendly error message on API failure
    return `An error occurred while generating a description for "${theme}". Please try again later.`;
  }
};

export const generateSmartReplies = async (messages: ChatMessage[], requesterName: string, donorName: string): Promise<string[]> => {
    const aiClient = getAiClient();
    if (!aiClient) {
        console.warn("Gemini API key is not configured. Returning mock replies.");
        return ["Thanks for your quick response!", "What's the best contact number?", "Can you confirm the location?"];
    }

    const chatHistory = messages
        .map(msg => `${msg.senderId === 'requester-456' ? requesterName : donorName}: ${msg.text}`)
        .join('\n');

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The following is a chat between a blood requestor (${requesterName}) and a potential donor (${donorName}). The last message was from the donor. Based on the context, generate exactly 3 short, helpful, and professional smart replies for the requester.
            
            Chat History:
            ${chatHistory}
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        replies: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.replies || [];
    } catch (error) {
        console.error("Error generating smart replies:", error);
        return [];
    }
};
