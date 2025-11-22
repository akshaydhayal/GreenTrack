import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({}) : null;

export async function POST(request: NextRequest) {
  try {
    const { scenario, originalFootprint, newFootprint, businessType } = await request.json();

    if (!ai) {
      return NextResponse.json({
        insights: "With these reductions, you could significantly improve your carbon footprint and potentially qualify for better sustainability ratings.",
      });
    }

    const prompt = `You are a sustainability consultant. Provide a brief, actionable insight (2-3 sentences) about the following carbon reduction scenario:

Business Type: ${businessType}
Original Monthly CO2: ${originalFootprint.toFixed(1)} kg
New Monthly CO2: ${newFootprint.toFixed(1)} kg
Reduction: ${((originalFootprint - newFootprint) / originalFootprint * 100).toFixed(1)}%

Reduction Breakdown:
- Electricity: ${scenario.electricity}%
- Water: ${scenario.water}%
- Waste: ${scenario.waste}%
- Fuel: ${scenario.fuel}%

Provide a brief, encouraging insight about what this reduction means for the business, potential benefits, and next steps. Keep it under 100 words.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
      });

      const insights = response.text || "This reduction would significantly improve your environmental impact and potentially reduce operational costs.";

      return NextResponse.json({ insights });
    } catch (error) {
      return NextResponse.json({
        insights: "This reduction would significantly improve your environmental impact and potentially reduce operational costs.",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate insights", details: error.message },
      { status: 500 }
    );
  }
}

