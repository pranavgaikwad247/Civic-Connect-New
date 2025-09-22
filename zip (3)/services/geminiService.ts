import { GoogleGenAI, Type } from "@google/genai";
// FIX: Corrected import path for types.
import { Report, AIScoreResponse } from "../types";

// Conditionally initialize the AI client to prevent browser crash
let ai: GoogleGenAI | null = null;

// This check ensures the code doesn't crash in a browser environment where `process` is undefined.
if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.warn("API_KEY not found. AI scoring will be mocked for this session.");
}


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: "A priority score from 0 to 100, where higher is more urgent."
        },
        summary: {
            type: Type.STRING,
            description: "A concise 2-sentence summary for the municipal admin."
        },
        department: {
            type: Type.STRING,
            description: "The suggested municipal department to handle the issue (e.g., Roads Department, Public Works)."
        },
        recommended_action: {
            type: Type.STRING,
            description: "A single, specific, and physical first action to be taken (e.g., 'Deploy a temporary steel plate')."
        },
        resolution_timeframe: {
            type: Type.STRING,
            description: "A suggested timeframe for resolution (e.g., 'Within 24 hours', '1-3 business days')."
        }
    }
};

// FIX: Aligned the parameter type with its usage in `ReportContext` by omitting `createdBy`. The AI scoring does not need to know who created the report.
export const scoreReportWithAI = async (reportData: Omit<Report, '_id' | 'createdAt' | 'upvotes' | 'upvoters' | 'status' | 'aiScore' | 'aiSummary' | 'adminNotified' | 'createdBy'>): Promise<AIScoreResponse> => {
    // If the AI client could not be initialized (e.g., no API key), return a mock response.
    if (!ai) {
        console.log("Using mocked AI response as fallback.");
        return Promise.resolve({
            score: Math.floor(Math.random() * 40) + 40, // Random score between 40-80
            summary: "This is a mocked AI summary because the API key is not configured. The system is operating in offline/demo mode.",
            department: "General Services",
            recommended_action: "Manual review and assignment required.",
            resolution_timeframe: "Pending Review"
        });
    }
    
    const prompt = `
    You are a municipal issue classification assistant. Given the following report fields, produce a JSON object that includes:
    1) A priority score from 0 to 100 (higher is more urgent). Consider public safety, environmental risks, time-sensitivity, potential for spread/damage.
    2) A concise 2-sentence summary for the municipal admin.
    3) The suggested municipal department to handle the issue.
    4) A specific, physical, recommended first action (e.g., "Dispatch crew to cone off the area and assess the damage.").
    5) A suggested resolution timeframe based on urgency (e.g., "Within 24 hours", "1-3 business days", "Within 2 weeks").

    Report Details:
    Title: ${reportData.title}
    Description: ${reportData.description}
    Category: ${reportData.category}
    Address: ${reportData.address}

    Respond ONLY with the JSON object matching the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonString = response.text.trim();
        const parsedResponse: AIScoreResponse = JSON.parse(jsonString);

        if (typeof parsedResponse.score !== 'number' || 
            typeof parsedResponse.summary !== 'string' || 
            typeof parsedResponse.department !== 'string' || 
            typeof parsedResponse.recommended_action !== 'string' ||
            typeof parsedResponse.resolution_timeframe !== 'string') {
            throw new Error("Invalid JSON structure from AI response.");
        }
        
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get AI assessment.");
    }
};