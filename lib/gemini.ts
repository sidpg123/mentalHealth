import { Content, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Initialize the Google Generative AI client
export const initGeminiClient = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

// Chat history type definitions
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Mental health specific prompt engineering
export const SYSTEM_PROMPT: Content = {
  role: "system",
  parts: [{ text: 'You are a supportive mental health assistant. Your role is to provide guidance, counseling, and mentoring to users seeking mental health support. Be empathetic, patient, and non-judgmental. Always suggest seeking professional help for serious concerns. Focus on evidence-based approaches like CBT, mindfulness, and relaxation techniques. Maintain a warm, supportive tone while being honest and realistic. Prioritize user safety - take mentions of self-harm or harm to others seriously. Respect privacy and confidentiality. Avoid making definitive diagnoses. If the conversation indicates an emergency situation, always recommend immediate professional help.' }]
};

// Function to get a response from Gemini
export async function getChatResponse(
  apiKey: string,
  messages: ChatMessage[]
) {
  try {
    const genAI = initGeminiClient(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Convert our messages to Gemini format
    const formattedHistory: Content[] = [];
    let systemInstructionContent: Content | undefined;

    for (const msg of messages) {
      if (msg.role === "system") {
        systemInstructionContent = {
          role: "system",
          parts: [{ text: msg.content }]
        };
        continue;
      }

      const geminiRole = msg.role === "assistant" ? "model" : "user";

      formattedHistory.push({
        role: geminiRole,
        parts: [{ text: msg.content }]
      });
    }

    // Use the provided system message or the default SYSTEM_PROMPT
    const systemInstruction: Content = systemInstructionContent || SYSTEM_PROMPT;

    // Start a new chat
    const chat = model.startChat({
      systemInstruction: systemInstruction,
      history: formattedHistory // Pass the formatted history here
    });

    // Send the last user message to get the response
    let response;
    const lastUserMessage = formattedHistory.findLast(msg => msg.role === "user");
    if (lastUserMessage) {
      response = await chat.sendMessage(lastUserMessage.parts[0].text ?? "");
    } else {
      // If there are assistant messages but no user message, send the last message
      const lastMessage = formattedHistory.length > 0 ? formattedHistory[formattedHistory.length - 1] : undefined;
      if (lastMessage) {
        response = await chat.sendMessage(lastMessage.parts[0].text ?? "");
      } else {
        return "Hello! How can I support your mental health today?";
      }
    }

    return response.response.text();
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    throw error;
  }
}


