import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  electricity: 0.82, // kg CO2 per kWh
  waste: 1.9, // kg CO2 per kg waste
  fuel: 2.31, // kg CO2 per liter
  water: 0.0003, // kg CO2 per liter (treatment and distribution)
};

interface BusinessData {
  businessType: string;
  employees: string;
  yearlyRevenue: string;
  electricityUsage: string;
  waterUsage: string;
  wasteGenerated: string;
  fuelUsed: string;
}

function calculateCarbonFootprint(data: BusinessData) {
  const electricity = parseFloat(data.electricityUsage) || 0;
  const water = parseFloat(data.waterUsage) || 0;
  const waste = parseFloat(data.wasteGenerated) || 0;
  const fuel = parseFloat(data.fuelUsed) || 0;

  const electricityCO2 = electricity * EMISSION_FACTORS.electricity;
  const waterCO2 = water * EMISSION_FACTORS.water;
  const wasteCO2 = waste * EMISSION_FACTORS.waste;
  const fuelCO2 = fuel * EMISSION_FACTORS.fuel;

  const totalCO2 = electricityCO2 + waterCO2 + wasteCO2 + fuelCO2;

  // Calculate footprint score (0-100 scale)
  // Normalize based on business size (employees)
  const employees = parseFloat(data.employees) || 1;
  const co2PerEmployee = totalCO2 / employees;
  
  // Score calculation: higher CO2 per employee = higher score
  let footprintScore = Math.min(100, (co2PerEmployee / 50) * 100);
  if (footprintScore < 20) footprintScore = 15;
  else if (footprintScore < 40) footprintScore = 30;
  else if (footprintScore < 60) footprintScore = 50;
  else footprintScore = 75;

  return {
    totalCO2,
    breakdown: {
      electricity: electricityCO2,
      water: waterCO2,
      waste: wasteCO2,
      fuel: fuelCO2,
    },
    footprintScore: Math.round(footprintScore),
  };
}

function getBadge(footprintScore: number, reductionPotential: number): string {
  if (reductionPotential >= 50) return "Platinum";
  if (reductionPotential >= 30) return "Gold";
  if (reductionPotential >= 20) return "Silver";
  return "Bronze";
}

export async function POST(request: NextRequest) {
  try {
    const data: BusinessData = await request.json();

    // Calculate carbon footprint
    const footprint = calculateCarbonFootprint(data);

    // Generate AI recommendations
    const prompt = `Act as a sustainability consultant for small businesses. Based on the following business information, provide detailed recommendations in JSON format.

Business Type: ${data.businessType}
Employees: ${data.employees}
Monthly Electricity Usage: ${data.electricityUsage} kWh
Monthly Water Usage: ${data.waterUsage} liters
Monthly Waste Generated: ${data.wasteGenerated} kg
Monthly Fuel Used: ${data.fuelUsed || 0} liters
Current Carbon Footprint Score: ${footprint.footprintScore}/100

Provide a JSON response with the following structure:
{
  "energy": [
    {
      "title": "Recommendation title",
      "description": "Detailed explanation",
      "savings": "Estimated monthly savings in currency",
      "impact": "CO2 reduction in kg/month"
    }
  ],
  "waste": [
    {
      "title": "Recommendation title",
      "description": "Detailed explanation",
      "savings": "Estimated monthly savings",
      "impact": "CO2 reduction in kg/month"
    }
  ],
  "costSavings": {
    "monthly": "Total estimated monthly savings",
    "yearly": "Total estimated yearly savings",
    "breakdown": "Brief explanation of savings sources"
  },
  "reductionPotential": ${Math.min(50, Math.max(10, 100 - footprint.footprintScore))}
}

Make recommendations specific to ${data.businessType} businesses. Be practical and actionable.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert sustainability consultant. Always respond with valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content || "{}";
    let recommendations;

    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      recommendations = JSON.parse(jsonString);
    } catch (error) {
      // Fallback recommendations if AI parsing fails
      recommendations = {
        energy: [
          {
            title: "Switch to LED Lighting",
            description: "Replace all incandescent and fluorescent bulbs with LED lights. LEDs use 75% less energy and last 25 times longer.",
            savings: "₹2,000-5,000/month",
            impact: "50-100 kg CO2/month",
          },
          {
            title: "Optimize HVAC System",
            description: "Regular maintenance, programmable thermostats, and proper insulation can reduce energy consumption by 20-30%.",
            savings: "₹3,000-8,000/month",
            impact: "100-200 kg CO2/month",
          },
        ],
        waste: [
          {
            title: "Implement Waste Segregation",
            description: "Separate recyclable materials to reduce landfill waste and potentially earn from recycling programs.",
            savings: "₹500-1,500/month",
            impact: "30-50 kg CO2/month",
          },
        ],
        costSavings: {
          monthly: "₹5,500-14,500",
          yearly: "₹66,000-174,000",
          breakdown: "Combined savings from energy optimization and waste reduction",
        },
        reductionPotential: Math.min(50, Math.max(10, 100 - footprint.footprintScore)),
      };
    }

    const badge = getBadge(footprint.footprintScore, recommendations.reductionPotential || 20);

    return NextResponse.json({
      footprint,
      recommendations,
      badge,
      businessData: data,
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze business data", details: error.message },
      { status: 500 }
    );
  }
}

