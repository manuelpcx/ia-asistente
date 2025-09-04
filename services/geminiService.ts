
import { GoogleGenAI, Type } from "@google/genai";
import { AppointmentDetails } from '../types';

// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
// This variable is assumed to be pre-configured and accessible in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const appointmentSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The title or subject of the appointment.",
    },
    date: {
      type: Type.STRING,
      description: "The date of the appointment in YYYY-MM-DD format. Infer from context if relative terms like 'tomorrow' are used.",
    },
    time: {
      type: Type.STRING,
      description: "The time of the appointment in HH:MM (24-hour) format.",
    },
    attendees: {
      type: Type.ARRAY,
      description: "A list of attendee names mentioned in the prompt.",
      items: { type: Type.STRING },
    },
    isReadyToSchedule: {
      type: Type.BOOLEAN,
      description: "Set to true only if title, date, and time are all present and confirmed. Otherwise, false.",
    },
    clarificationQuestion: {
      type: Type.STRING,
      description: "If any information (title, date, or time) is missing, formulate a friendly question to ask the user for the missing piece. If nothing is missing, this should be null.",
    },
  },
};

export const getAppointmentDetailsFromText = async (prompt: string): Promise<AppointmentDetails | { error: string }> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const systemInstruction = `You are an expert appointment scheduling assistant. Your goal is to extract appointment details from the user's message. The details are: title, date, time, and a list of attendees. Today's date is ${today}. If any information is missing, ask clarifying questions. If all information is present, confirm the details by setting isReadyToSchedule to true.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: appointmentSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    return parsedJson as AppointmentDetails;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a user-friendly error message without exposing internal details.
    return { error: "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment." };
  }
};
