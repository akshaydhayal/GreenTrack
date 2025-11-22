import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// Load benchmark data
const benchmarksPath = path.join(process.cwd(), "app", "data", "benchmarks.json");
const roiDataPath = path.join(process.cwd(), "app", "data", "roi-data.json");
const benchmarks = JSON.parse(fs.readFileSync(benchmarksPath, "utf8"));
const roiData = JSON.parse(fs.readFileSync(roiDataPath, "utf8"));

// Initialize Gemini client - automatically picks up GEMINI_API_KEY from environment
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({}) : null;

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

function calculateBenchmark(data: BusinessData, totalCO2: number, aiBenchmark?: any): any {
  const employees = parseFloat(data.employees) || 1;
  
  // Use AI-generated benchmark if provided
  if (aiBenchmark && aiBenchmark.avgCO2PerMonth) {
    const avgCO2 = aiBenchmark.avgCO2PerMonth;
    const difference = ((totalCO2 - avgCO2) / avgCO2) * 100;
    return {
      avgCO2,
      yourCO2: totalCO2,
      difference: Math.round(difference),
      comparison: difference > 0 ? "above" : "below",
      percentage: Math.abs(Math.round(difference)),
      benchmarkRange: aiBenchmark.benchmarkRange || `${employees} employees`,
      industryContext: aiBenchmark.industryContext,
      source: "AI-generated",
    };
  }
  
  // Fallback to static benchmarks
  const businessType = data.businessType as keyof typeof benchmarks;
  
  // Determine business size category
  let sizeCategory: "small" | "medium" | "large";
  if (employees <= 10) sizeCategory = "small";
  else if (employees <= 25) sizeCategory = "medium";
  else sizeCategory = "large";
  
  // Get benchmark data
  const benchmark = benchmarks[businessType]?.[sizeCategory];
  if (!benchmark) {
    // Fallback to "Other" category
    const otherBenchmark = benchmarks["Other"][sizeCategory];
    if (!otherBenchmark) return null;
    
    const avgCO2 = otherBenchmark.avgCO2PerMonth;
    const difference = ((totalCO2 - avgCO2) / avgCO2) * 100;
    return {
      avgCO2,
      yourCO2: totalCO2,
      difference: Math.round(difference),
      comparison: difference > 0 ? "above" : "below",
      percentage: Math.abs(Math.round(difference)),
      source: "static-data",
    };
  }
  
  const avgCO2 = benchmark.avgCO2PerMonth;
  const difference = ((totalCO2 - avgCO2) / avgCO2) * 100;
  
  return {
    avgCO2,
    yourCO2: totalCO2,
    difference: Math.round(difference),
    comparison: difference > 0 ? "above" : "below",
    percentage: Math.abs(Math.round(difference)),
    benchmarkRange: benchmark.employees,
    source: "static-data",
  };
}

function calculateROI(recommendations: any, businessData: BusinessData, aiROI?: Array<any>): Array<{
  title: string;
  upfrontCost: number;
  monthlySavings: number;
  roiMonths: number;
  description: string;
  category: string;
}> {
  const roiResults: Array<{
    title: string;
    upfrontCost: number;
    monthlySavings: number;
    roiMonths: number;
    description: string;
    category: string;
  }> = [];
  
  // Use AI-generated ROI if provided
  if (aiROI && Array.isArray(aiROI) && aiROI.length > 0) {
    aiROI.forEach((item: any) => {
      if (item.title && item.upfrontCost && item.monthlySavings) {
        const roiMonths = item.monthlySavings > 0 ? item.upfrontCost / item.monthlySavings : 0;
        roiResults.push({
          title: item.title,
          upfrontCost: Math.round(item.upfrontCost),
          monthlySavings: Math.round(item.monthlySavings),
          roiMonths: Math.round(roiMonths * 10) / 10,
          description: item.description || "",
          category: item.category || "energy",
        });
      }
    });
    
    if (roiResults.length > 0) {
      return roiResults.sort((a, b) => a.roiMonths - b.roiMonths);
    }
  }
  
  // Fallback to static ROI data
  // Process energy recommendations
  if (recommendations.energy) {
    recommendations.energy.forEach((rec: any) => {
      const roiInfo = roiData.energy[rec.title as keyof typeof roiData.energy];
      if (roiInfo) {
        const monthlySavings = roiInfo.monthlySavings;
        const upfrontCost = roiInfo.upfrontCost;
        const roiMonths = monthlySavings > 0 ? upfrontCost / monthlySavings : 0;
        
        roiResults.push({
          title: rec.title,
          upfrontCost,
          monthlySavings,
          roiMonths: Math.round(roiMonths * 10) / 10,
          description: roiInfo.description,
          category: "energy",
        });
      }
    });
  }
  
  // Process waste recommendations
  if (recommendations.waste) {
    recommendations.waste.forEach((rec: any) => {
      const roiInfo = roiData.waste[rec.title as keyof typeof roiData.waste];
      if (roiInfo) {
        const monthlySavings = roiInfo.monthlySavings;
        const upfrontCost = roiInfo.upfrontCost;
        const roiMonths = monthlySavings > 0 ? upfrontCost / monthlySavings : 0;
        
        roiResults.push({
          title: rec.title,
          upfrontCost,
          monthlySavings,
          roiMonths: Math.round(roiMonths * 10) / 10,
          description: roiInfo.description,
          category: "waste",
        });
      }
    });
  }
  
  // Sort by ROI (fastest payback first)
  return roiResults.sort((a, b) => a.roiMonths - b.roiMonths);
}

function findIncentives(data: BusinessData, recommendations: any, footprint: any, aiIncentives?: Array<any>): Array<{
  title: string;
  description: string;
  eligibility: string;
  value: string;
  category: string;
  applicationLink?: string;
}> {
  // Use AI-generated incentives if provided
  if (aiIncentives && Array.isArray(aiIncentives) && aiIncentives.length > 0) {
    return aiIncentives;
  }
  
  // Fallback to generic incentives with valid links
  return [
    {
      title: "Solar Investment Tax Credit (ITC)",
      description: "Federal tax credit for installing solar energy systems. Can cover up to 30% of installation costs for commercial solar installations.",
      eligibility: "Businesses installing solar panels for commercial use",
      value: "Up to 30% of installation cost",
      category: "solar",
      applicationLink: "https://www.energy.gov/eere/solar/solar-investment-tax-credit-itc",
    },
    {
      title: "Energy Star Rebate Finder",
      description: "Find rebates and incentives for Energy Star certified appliances and equipment in your area.",
      eligibility: "Small businesses replacing old equipment with Energy Star certified models",
      value: "$50-$500 per appliance",
      category: "energy",
      applicationLink: "https://www.energystar.gov/rebate-finder",
    },
    {
      title: "EPA Waste Reduction Grants",
      description: "Grants and funding opportunities for implementing waste reduction, recycling, and sustainable materials management programs.",
      eligibility: "Businesses implementing new waste management systems",
      value: "$1,000-$5,000",
      category: "waste",
      applicationLink: "https://www.epa.gov/grants",
    },
    {
      title: "Small Business Energy Efficiency Program",
      description: "Federal programs offering technical assistance and financing for energy efficiency improvements.",
      eligibility: "Small businesses making energy efficiency upgrades",
      value: "Varies by program",
      category: "energy",
      applicationLink: "https://www.energy.gov/eere/slsc/small-business-energy-efficiency-programs",
    },
    {
      title: "Green Business Certification Programs",
      description: "Certification programs that provide recognition and potential tax benefits for sustainable business practices.",
      eligibility: "Businesses meeting sustainability criteria",
      value: "Certification benefits and tax credits",
      category: "other",
      applicationLink: "https://www.epa.gov/greeningepa/green-business-certification",
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const data: BusinessData = await request.json();

    // Calculate carbon footprint
    const footprint = calculateCarbonFootprint(data);

    // Generate comprehensive AI analysis in a single request
    const comprehensivePrompt = `You are an expert sustainability consultant and data analyst. Based on the following business information, provide a COMPREHENSIVE analysis in a single JSON response.

Business Information:
- Type: ${data.businessType}
- Employees: ${data.employees}
- Yearly Revenue: ${data.yearlyRevenue || "Not specified"}
- Monthly Electricity Usage: ${data.electricityUsage} kWh
- Monthly Water Usage: ${data.waterUsage} liters
- Monthly Waste Generated: ${data.wasteGenerated} kg
- Monthly Fuel Used: ${data.fuelUsed || 0} liters
- Current Monthly CO2 Emissions: ${footprint.totalCO2.toFixed(1)} kg CO₂
- Current Carbon Footprint Score: ${footprint.footprintScore}/100

Provide a JSON response with this EXACT structure (all fields required):
{
  "recommendations": {
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
  },
  "benchmark": {
    "avgCO2PerMonth": <average monthly CO2 in kg for similar businesses>,
    "avgCO2PerEmployee": <average CO2 per employee per month>,
    "benchmarkRange": "<employee range like '1-10' or '11-25'>",
    "industryContext": "<brief context about typical emissions for this business type>"
  },
  "roi": [
    {
      "title": "<exact recommendation title from above>",
      "upfrontCost": <realistic upfront cost in USD>,
      "monthlySavings": <realistic monthly savings in USD>,
      "description": "<brief description>",
      "category": "<energy or waste>"
    }
  ],
  "incentives": [
    {
      "title": "<Subsidy/Program Name>",
      "description": "<What it covers and benefits>",
      "eligibility": "<Who qualifies and requirements>",
      "value": "<Estimated value or percentage>",
      "category": "<solar|energy|waste|tax|other>",
      "applicationLink": "<Valid government URL or use: https://www.energy.gov/eere/solar/solar-investment-tax-credit-itc for solar, https://www.energystar.gov/rebate-finder for energy, https://www.epa.gov/grants for waste>"
    }
  ]
}

IMPORTANT:
- Make recommendations specific to ${data.businessType} businesses
- Use realistic industry averages for benchmarks
- Calculate ROI based on business size and revenue
- Find 3-5 relevant government incentives
- All monetary values in USD
- All links must be valid government URLs
- Respond with ONLY valid JSON, no additional text or markdown`;

    let aiAnalysis: any = null;

    // Use AI if available - single comprehensive request
    if (ai) {
      try {
        const fullPrompt = `You are an expert sustainability consultant and data analyst. Always respond with valid JSON only, no additional text or markdown.

${comprehensivePrompt}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-lite",
          contents: fullPrompt,
        });

        const aiResponse = response.text || "{}";
        
        try {
          // Extract JSON from response (handle markdown code blocks)
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
          aiAnalysis = JSON.parse(jsonString);
        } catch (parseError) {
          console.warn("AI JSON parsing failed:", parseError);
          aiAnalysis = null;
        }
      } catch (aiError) {
        console.warn("AI generation failed, using fallbacks:", aiError);
        aiAnalysis = null;
      }
    }

    // Extract data from AI analysis or use fallbacks
    let recommendations, benchmark, roiCalculations, incentives;

    if (aiAnalysis) {
      // Use AI-generated data
      recommendations = aiAnalysis.recommendations || null;
      roiCalculations = aiAnalysis.roi ? aiAnalysis.roi.map((item: any) => {
        const roiMonths = item.monthlySavings > 0 ? item.upfrontCost / item.monthlySavings : 0;
        return {
          title: item.title,
          upfrontCost: Math.round(item.upfrontCost),
          monthlySavings: Math.round(item.monthlySavings),
          roiMonths: Math.round(roiMonths * 10) / 10,
          description: item.description || "",
          category: item.category || "energy",
        };
      }).sort((a: any, b: any) => a.roiMonths - b.roiMonths) : null;
      incentives = aiAnalysis.incentives || null;

      // Process benchmark from AI
      if (aiAnalysis.benchmark && aiAnalysis.benchmark.avgCO2PerMonth) {
        const avgCO2 = aiAnalysis.benchmark.avgCO2PerMonth;
        const difference = ((footprint.totalCO2 - avgCO2) / avgCO2) * 100;
        benchmark = {
          avgCO2,
          yourCO2: footprint.totalCO2,
          difference: Math.round(difference),
          comparison: difference > 0 ? "above" : "below",
          percentage: Math.abs(Math.round(difference)),
          benchmarkRange: aiAnalysis.benchmark.benchmarkRange || `${data.employees} employees`,
          industryContext: aiAnalysis.benchmark.industryContext,
          source: "AI-generated",
        };
      }
    }

    // Fallback recommendations if AI is not available or fails
    if (!recommendations) {
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

    // Fallback to individual calculations if AI didn't provide everything
    if (!benchmark) {
      benchmark = calculateBenchmark(data, footprint.totalCO2, aiAnalysis?.benchmark);
    }
    
    if (!roiCalculations || roiCalculations.length === 0) {
      roiCalculations = calculateROI(recommendations, data, aiAnalysis?.roi);
    }
    
    if (!incentives || incentives.length === 0) {
      incentives = findIncentives(data, recommendations, footprint, aiAnalysis?.incentives);
    }

    const badge = getBadge(footprint.footprintScore, recommendations.reductionPotential || 20);

    return NextResponse.json({
      footprint,
      recommendations,
      badge,
      businessData: data,
      benchmark,
      roi: roiCalculations,
      incentives,
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze business data", details: error.message },
      { status: 500 }
    );
  }
}

