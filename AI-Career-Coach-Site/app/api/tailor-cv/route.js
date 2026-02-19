import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobTitle, jobDescription, cvData } = await req.json();

        const prompt = `
      You are an expert resume writer. 
      Tailor the following CV data for the role of "${jobTitle}" with the description: "${jobDescription}".
      
      Focus on highlighting relevant skills and experiences. 
      Do NOT invent new experiences, but feel free to rephrase existing ones to better match the job description.
      
      Return the updated CV data as a valid JSON object. 
      The JSON structure MUST match the input structure exactly.
      Do not include any markdown formatting or explanations, just the raw JSON.

      Input CV Data:
      ${JSON.stringify(cvData)}
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ output: text });
    } catch (error) {
        console.error("Error tailoring CV:", error);
        return NextResponse.json({ error: "Failed to tailor CV" }, { status: 500 });
    }
}
