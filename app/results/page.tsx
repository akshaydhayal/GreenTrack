"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Leaf, TrendingDown, DollarSign, Award, TrendingUp, BarChart3, Gift, Sliders, Home, Target, Calculator, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AnalysisResult {
  footprint: {
    totalCO2: number;
    breakdown: {
      electricity: number;
      water: number;
      waste: number;
      fuel: number;
    };
    footprintScore: number;
  };
  recommendations: {
    energy: Array<{
      title: string;
      description: string;
      savings: string;
      impact: string;
    }>;
    waste: Array<{
      title: string;
      description: string;
      savings: string;
      impact: string;
    }>;
    costSavings: {
      monthly: string;
      yearly: string;
      breakdown: string;
    };
    reductionPotential: number;
  };
  badge: string;
  businessData: {
    businessType: string;
    employees: string;
    electricityUsage?: string;
    waterUsage?: string;
    wasteGenerated?: string;
    fuelUsed?: string;
  };
  benchmark?: {
    avgCO2: number;
    yourCO2: number;
    difference: number;
    comparison: "above" | "below";
    percentage: number;
    benchmarkRange?: string;
    industryContext?: string;
    source?: string;
  } | null;
  roi?: Array<{
    title: string;
    upfrontCost: number;
    monthlySavings: number;
    roiMonths: number;
    description: string;
    category: string;
  }>;
  incentives?: Array<{
    title: string;
    description: string;
    eligibility: string;
    value: string;
    category: string;
    applicationLink?: string;
  }>;
}

type BadgeType = "Bronze" | "Silver" | "Gold" | "Platinum";

const BADGE_COLORS: Record<BadgeType, string> = {
  Bronze: "#CD7F32",
  Silver: "#C0C0C0",
  Gold: "#FFD700",
  Platinum: "#E5E4E2",
};

export default function ResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [downloading, setDownloading] = useState(false);
  
  // Scenario simulator state
  const [scenario, setScenario] = useState({
    electricity: 0,
    water: 0,
    waste: 0,
    fuel: 0,
  });
  const [scenarioResult, setScenarioResult] = useState<any>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("overview");
  
  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "benchmark", label: "Benchmark", icon: BarChart3 },
    { id: "recommendations", label: "Recommendations", icon: Target },
    { id: "roi", label: "ROI Calculator", icon: Calculator },
    { id: "incentives", label: "Incentives", icon: Gift },
    { id: "scenario", label: "Simulator", icon: Sliders },
  ];

  useEffect(() => {
    const analyzeBusiness = async () => {
      const businessDataStr = sessionStorage.getItem("businessData");
      if (!businessDataStr) {
        router.push("/analyze");
        return;
      }

      try {
        const businessData = JSON.parse(businessDataStr);
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(businessData),
        });

        if (!response.ok) throw new Error("Analysis failed");

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to analyze business. Please try again.");
        router.push("/analyze");
      } finally {
        setLoading(false);
      }
    };

    analyzeBusiness();
  }, [router]);

  const getScoreColor = (score: number) => {
    if (score < 20) return "text-primary-600";
    if (score < 40) return "text-primary-500";
    if (score < 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreLabel = (score: number) => {
    if (score < 20) return "Excellent";
    if (score < 40) return "Good";
    if (score < 60) return "Moderate";
    return "Poor";
  };

  const calculateScenario = async (scenarioData: typeof scenario) => {
    if (!result) return;

    // Calculate new footprint
    const electricity = parseFloat(result.businessData.electricityUsage || "0") * (1 - scenarioData.electricity / 100);
    const water = parseFloat(result.businessData.waterUsage || "0") * (1 - scenarioData.water / 100);
    const waste = parseFloat(result.businessData.wasteGenerated || "0") * (1 - scenarioData.waste / 100);
    const fuel = parseFloat(result.businessData.fuelUsed || "0") * (1 - scenarioData.fuel / 100);

    const EMISSION_FACTORS = {
      electricity: 0.82,
      waste: 1.9,
      fuel: 2.31,
      water: 0.0003,
    };

    const electricityCO2 = electricity * EMISSION_FACTORS.electricity;
    const waterCO2 = water * EMISSION_FACTORS.water;
    const wasteCO2 = waste * EMISSION_FACTORS.waste;
    const fuelCO2 = fuel * EMISSION_FACTORS.fuel;

    const newTotalCO2 = electricityCO2 + waterCO2 + wasteCO2 + fuelCO2;
    const employees = parseFloat(result.businessData.employees) || 1;
    const co2PerEmployee = newTotalCO2 / employees;
    
    let newScore = Math.min(100, (co2PerEmployee / 50) * 100);
    if (newScore < 20) newScore = 15;
    else if (newScore < 40) newScore = 30;
    else if (newScore < 60) newScore = 50;
    else newScore = 75;

    const reduction = result.footprint.totalCO2 - newTotalCO2;
    const reductionPercent = (reduction / result.footprint.totalCO2) * 100;
    const newBadge = getBadge(newScore, reductionPercent);

    // Get AI insights for the scenario
    let aiInsights = "";
    if (scenarioData.electricity > 0 || scenarioData.waste > 0 || scenarioData.fuel > 0) {
      try {
        const response = await fetch("/api/scenario-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario: scenarioData,
            originalFootprint: result.footprint.totalCO2,
            newFootprint: newTotalCO2,
            businessType: result.businessData.businessType,
          }),
        });
        const insights = await response.json();
        aiInsights = insights.insights || "";
      } catch (error) {
        console.warn("Failed to get AI insights:", error);
      }
    }

    setScenarioResult({
      newTotalCO2,
      newScore: Math.round(newScore),
      newBadge,
      reduction,
      reductionPercent: Math.round(reductionPercent),
      savings: {
        electricity: electricityCO2,
        water: waterCO2,
        waste: wasteCO2,
        fuel: fuelCO2,
      },
      aiInsights,
    });
  };

  const getBadge = (score: number, reductionPotential: number): string => {
    if (reductionPotential >= 50) return "Platinum";
    if (reductionPotential >= 30) return "Gold";
    if (reductionPotential >= 20) return "Silver";
    return "Bronze";
  };

  useEffect(() => {
    if (result && (scenario.electricity !== 0 || scenario.water !== 0 || scenario.waste !== 0 || scenario.fuel !== 0)) {
      calculateScenario(scenario);
    } else {
      setScenarioResult(null);
    }
  }, [scenario, result]);

  const handleDownloadPDF = async () => {
    if (!result) return;

    setDownloading(true);
    try {
      const element = document.getElementById("report-content");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`greentrack-report-${result.businessData.businessType}-${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-primary-200 text-lg">Analyzing your business...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const breakdownData = [
    { name: "Electricity", value: result.footprint.breakdown.electricity, color: "#3B82F6" },
    { name: "Waste", value: result.footprint.breakdown.waste, color: "#EF4444" },
    { name: "Fuel", value: result.footprint.breakdown.fuel, color: "#F59E0B" },
    { name: "Water", value: result.footprint.breakdown.water, color: "#10B981" },
  ].filter((item) => item.value > 0);

  const recommendationsData = [
    ...result.recommendations.energy.map((r) => ({
      name: r.title.substring(0, 20) + "...",
      savings: parseFloat(r.savings.match(/[\d,]+/)?.[0]?.replace(/,/g, "") || "0"),
    })),
    ...result.recommendations.waste.map((r) => ({
      name: r.title.substring(0, 20) + "...",
      savings: parseFloat(r.savings.match(/[\d,]+/)?.[0]?.replace(/,/g, "") || "0"),
    })),
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-primary-300 hover:text-primary-200 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div id="report-content" className="space-y-4">
          {/* Header */}
          <div className="card text-center py-2 px-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-0.5">
              Your Sustainability Report
            </h1>
            <p className="text-gray-300 text-xs">
              {result.businessData.businessType} • {result.businessData.employees} Employees
            </p>
          </div>

          {/* Key Metrics - Always Visible */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Carbon Score */}
            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingDown className="w-8 h-8 text-primary-400" />
              </div>
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.footprint.footprintScore)}`}>
                {result.footprint.footprintScore}
              </div>
              <div className="text-primary-200 font-semibold mb-1">Carbon Footprint Score</div>
              <div className={`text-sm font-medium ${getScoreColor(result.footprint.footprintScore)}`}>
                {getScoreLabel(result.footprint.footprintScore)}
              </div>
              <div className="text-xs text-gray-200 mt-2">
                {result.footprint.totalCO2.toFixed(1)} kg CO₂/month
              </div>
            </div>

            {/* Cost Savings */}
            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-primary-400" />
              </div>
              <div className="text-3xl font-bold text-primary-400 mb-2">
                {result.recommendations.costSavings.monthly}
              </div>
              <div className="text-primary-200 font-semibold mb-1">Monthly Savings</div>
              <div className="text-sm text-gray-200">
                {result.recommendations.costSavings.yearly} yearly
              </div>
            </div>

            {/* Badge */}
            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-8 h-8" style={{ color: BADGE_COLORS[result.badge as BadgeType] || BADGE_COLORS.Bronze }} />
              </div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: BADGE_COLORS[result.badge as BadgeType] || BADGE_COLORS.Bronze }}
              >
                {result.badge}
              </div>
              <div className="text-primary-200 font-semibold mb-1">Achievement Badge</div>
              <div className="text-sm text-gray-200">
                {result.recommendations.reductionPotential}% reduction potential
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="card p-0 overflow-hidden">
            <div className="border-b border-primary-700 bg-primary-900/50">
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? "text-primary-200 bg-primary-800 border-b-2 border-primary-400"
                          : "text-gray-300 hover:text-primary-200 hover:bg-primary-800/50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-primary-400" : "text-gray-300"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Carbon Breakdown Chart */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-6">Carbon Footprint Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={breakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {breakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Cost Savings Breakdown */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-6">Cost Savings Forecast</h2>
                    <div className="bg-gradient-to-r from-primary-800 via-primary-700/50 to-primary-800 p-6 rounded-xl border border-primary-600 shadow-md">
                      <p className="text-gray-200 mb-4">{result.recommendations.costSavings.breakdown}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-primary-200">Monthly Savings</div>
                          <div className="text-2xl font-bold text-primary-400">
                            {result.recommendations.costSavings.monthly}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-primary-200">Yearly Savings</div>
                          <div className="text-2xl font-bold text-primary-400">
                            {result.recommendations.costSavings.yearly}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Benchmark Tab */}
              {activeTab === "benchmark" && result.benchmark && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-r from-primary-800 to-primary-700 p-6 rounded-xl border border-primary-600">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Your Business</p>
                        <p className="text-2xl font-bold text-gray-100">
                          {result.benchmark.yourCO2.toFixed(1)} kg CO₂/month
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300 mb-1">Industry Average</p>
                        <p className="text-2xl font-bold text-primary-400">
                          {result.benchmark.avgCO2.toFixed(1)} kg CO₂/month
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-300 mb-2">Your Business</p>
                          <div className="relative h-8 bg-primary-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full flex items-center justify-center transition-all duration-500 ${
                                result.benchmark.comparison === "above" ? "bg-orange-500" : "bg-green-500"
                              }`}
                              style={{ 
                                width: `${Math.min(100, (result.benchmark.yourCO2 / Math.max(result.benchmark.yourCO2, result.benchmark.avgCO2)) * 100)}%` 
                              }}
                            >
                              <span className="text-xs text-white font-semibold">
                                {((result.benchmark.yourCO2 / Math.max(result.benchmark.yourCO2, result.benchmark.avgCO2)) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-300 mb-2">Industry Average</p>
                          <div className="relative h-8 bg-primary-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full flex items-center justify-center transition-all duration-500"
                              style={{ 
                                width: `${(result.benchmark.avgCO2 / Math.max(result.benchmark.yourCO2, result.benchmark.avgCO2)) * 100}%` 
                              }}
                            >
                              <span className="text-xs text-white font-semibold">
                                {((result.benchmark.avgCO2 / Math.max(result.benchmark.yourCO2, result.benchmark.avgCO2)) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-center p-4 rounded-lg ${
                      result.benchmark.comparison === "above" 
                        ? "bg-orange-900/30 border border-orange-600/50" 
                        : "bg-green-900/30 border border-green-600/50"
                    }`}>
                      <p className="text-lg font-semibold text-gray-100 mb-1">
                        Your {result.businessData.businessType.toLowerCase()} emits{" "}
                        <span className={`font-bold ${
                          result.benchmark.comparison === "above" ? "text-orange-400" : "text-green-400"
                        }`}>
                          {result.benchmark.percentage}% {result.benchmark.comparison}
                        </span>{" "}
                        the industry average
                      </p>
                      {result.benchmark.benchmarkRange && (
                        <p className="text-sm text-gray-300">
                          Based on {result.benchmark.benchmarkRange} employees in your industry
                        </p>
                      )}
                      {result.benchmark.industryContext && (
                        <p className="text-sm text-gray-300 mt-2 italic">
                          {result.benchmark.industryContext}
                        </p>
                      )}
                      {result.benchmark.source === "AI-generated" && (
                        <p className="text-xs text-primary-400 mt-2 flex items-center justify-center gap-1">
                          <span>✨</span> AI-powered benchmark analysis
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === "recommendations" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Energy Recommendations */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                      <Leaf className="w-6 h-6 text-primary-400" />
                      Energy Optimization Recommendations
                    </h2>
                    <div className="space-y-4">
                      {result.recommendations.energy.map((rec, index) => {
                        const roiItem = result.roi?.find(r => r.title === rec.title);
                        return (
                          <div key={index} className="border-l-4 border-primary-500 pl-4 py-3 bg-gradient-to-r from-primary-800/50 to-primary-700/50 rounded-r-xl shadow-sm">
                            <h3 className="font-semibold text-lg text-gray-100 mb-2">{rec.title}</h3>
                            <p className="text-gray-300 mb-3 leading-relaxed">{rec.description}</p>
                            <div className="flex gap-4 text-sm flex-wrap">
                              <span className="text-primary-200 font-semibold bg-primary-900/70 px-3 py-1 rounded-lg border border-primary-600 shadow-sm">💰 {rec.savings}</span>
                              <span className="text-primary-300 font-semibold bg-primary-900/70 px-3 py-1 rounded-lg border border-primary-600 shadow-sm">🌱 {rec.impact}</span>
                              {roiItem && (
                                <span className="text-green-300 font-semibold bg-primary-900/70 px-3 py-1 rounded-lg border border-green-600 shadow-sm">
                                  ⏱️ ROI: {roiItem.roiMonths} {roiItem.roiMonths === 1 ? "month" : "months"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Waste Recommendations */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                      <Leaf className="w-6 h-6 text-primary-400" />
                      Waste Reduction Recommendations
                    </h2>
                    <div className="space-y-4">
                      {result.recommendations.waste.map((rec, index) => {
                        const roiItem = result.roi?.find(r => r.title === rec.title);
                        return (
                          <div key={index} className="border-l-4 border-primary-500 pl-4 py-3 bg-gradient-to-r from-primary-800/50 to-primary-700/50 rounded-r-xl shadow-sm">
                            <h3 className="font-semibold text-lg text-gray-100 mb-2">{rec.title}</h3>
                            <p className="text-gray-300 mb-3 leading-relaxed">{rec.description}</p>
                            <div className="flex gap-4 text-sm flex-wrap">
                              <span className="text-primary-200 font-semibold bg-primary-900/70 px-3 py-1 rounded-lg border border-primary-600 shadow-sm">💰 {rec.savings}</span>
                              <span className="text-primary-300 font-semibold bg-primary-900/70 px-3 py-1 rounded-lg border border-primary-600 shadow-sm">🌱 {rec.impact}</span>
                              {roiItem && (
                                <span className="text-green-300 font-semibold bg-primary-900/70 px-3 py-1 rounded-lg border border-green-600 shadow-sm">
                                  ⏱️ ROI: {roiItem.roiMonths} {roiItem.roiMonths === 1 ? "month" : "months"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ROI Calculator Tab */}
              {activeTab === "roi" && result.roi && result.roi.length > 0 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">ROI Calculator</h2>
                    <p className="text-gray-300 mb-6">
                      See how quickly your sustainability investments pay for themselves
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-primary-800 border-b-2 border-primary-600">
                            <th className="text-left py-3 px-4 font-semibold text-gray-100">Action</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-100">Upfront Cost</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-100">Monthly Savings</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-100">ROI Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.roi.map((item, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-primary-700 hover:bg-primary-800/50 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div className="font-semibold text-gray-100">{item.title}</div>
                                <div className="text-sm text-gray-300 mt-1">{item.description}</div>
                              </td>
                              <td className="text-right py-4 px-4">
                                <span className="font-semibold text-gray-100">${item.upfrontCost.toLocaleString()}</span>
                              </td>
                              <td className="text-right py-4 px-4">
                                <span className="font-semibold text-green-400">${item.monthlySavings.toLocaleString()}/mo</span>
                              </td>
                              <td className="text-right py-4 px-4">
                                <span className={`font-bold ${
                                  item.roiMonths <= 6 ? "text-green-400" :
                                  item.roiMonths <= 12 ? "text-primary-400" :
                                  "text-orange-400"
                                }`}>
                                  {item.roiMonths} {item.roiMonths === 1 ? "month" : "months"}
                                </span>
                                {item.roiMonths <= 6 && (
                                  <span className="ml-2 text-xs bg-green-800 text-green-300 px-2 py-1 rounded-full">Fast ROI</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 p-4 bg-primary-800 rounded-lg border border-primary-600">
                      <p className="text-sm text-gray-200">
                        <strong>💡 Tip:</strong> Actions with ROI under 6 months are quick wins and should be prioritized first.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Incentives Tab */}
              {activeTab === "incentives" && result.incentives && result.incentives.length > 0 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-100">Eligible Incentives & Subsidies</h2>
                      <p className="text-gray-300 mt-2">
                        Government programs and subsidies that can help fund your sustainability improvements
                      </p>
                    </div>
                    <div className="bg-primary-800 text-primary-200 px-4 py-2 rounded-full font-semibold">
                      {result.incentives.length} Available
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.incentives.map((incentive, index) => (
                      <div
                        key={index}
                        className="border-2 border-primary-600 rounded-xl p-5 hover:border-primary-500 hover:shadow-md transition-all bg-gradient-to-br from-primary-800/80 to-primary-700/50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-100 mb-2">{incentive.title}</h3>
                            <p className="text-gray-300 text-sm mb-3 leading-relaxed">{incentive.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            incentive.category === "solar" ? "bg-yellow-800 text-yellow-200" :
                            incentive.category === "energy" ? "bg-blue-800 text-blue-200" :
                            incentive.category === "waste" ? "bg-green-800 text-green-200" :
                            incentive.category === "tax" ? "bg-purple-800 text-purple-200" :
                            "bg-gray-700 text-gray-200"
                          }`}>
                            {incentive.category}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="bg-primary-900/70 rounded-lg p-3 border border-primary-600">
                            <p className="text-xs text-gray-300 mb-1">Eligibility</p>
                            <p className="text-sm text-gray-200">{incentive.eligibility}</p>
                          </div>
                          <div className="bg-primary-800 rounded-lg p-3 border border-primary-600">
                            <p className="text-xs text-gray-300 mb-1">Estimated Value</p>
                            <p className="text-sm font-semibold text-primary-200">{incentive.value}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (incentive.applicationLink && !incentive.applicationLink.includes("Contact")) {
                              window.open(incentive.applicationLink, "_blank");
                            } else {
                              window.open("https://www.usa.gov/state-local-governments", "_blank");
                            }
                          }}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Learn More →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scenario Simulator Tab */}
              {activeTab === "scenario" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Scenario Simulator</h2>
                    <p className="text-gray-300 mb-6">
                      Adjust sliders to see how different reductions impact your carbon footprint, score, and savings
                    </p>
                    
                    <div className="space-y-6">
                      {/* Electricity Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                            🔋 Electricity Reduction
                          </label>
                          <span className="text-sm font-bold text-primary-400">{scenario.electricity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={scenario.electricity}
                          onChange={(e) => setScenario({ ...scenario, electricity: parseInt(e.target.value) })}
                          className="w-full h-3 bg-primary-800 rounded-lg appearance-none cursor-pointer accent-primary-400"
                        />
                        <div className="flex justify-between text-xs text-gray-300 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                        </div>
                      </div>

                      {/* Water Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                            💧 Water Reduction
                          </label>
                          <span className="text-sm font-bold text-primary-400">{scenario.water}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={scenario.water}
                          onChange={(e) => setScenario({ ...scenario, water: parseInt(e.target.value) })}
                          className="w-full h-3 bg-primary-800 rounded-lg appearance-none cursor-pointer accent-primary-400"
                        />
                        <div className="flex justify-between text-xs text-gray-300 mt-1">
                          <span>0%</span>
                          <span>40%</span>
                        </div>
                      </div>

                      {/* Waste Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                            ♻️ Waste Reduction
                          </label>
                          <span className="text-sm font-bold text-primary-400">{scenario.waste}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={scenario.waste}
                          onChange={(e) => setScenario({ ...scenario, waste: parseInt(e.target.value) })}
                          className="w-full h-3 bg-primary-800 rounded-lg appearance-none cursor-pointer accent-primary-400"
                        />
                        <div className="flex justify-between text-xs text-gray-300 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                        </div>
                      </div>

                      {/* Fuel Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                            🚛 Fuel Reduction
                          </label>
                          <span className="text-sm font-bold text-primary-400">{scenario.fuel}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={scenario.fuel}
                          onChange={(e) => setScenario({ ...scenario, fuel: parseInt(e.target.value) })}
                          className="w-full h-3 bg-primary-800 rounded-lg appearance-none cursor-pointer accent-primary-400"
                        />
                        <div className="flex justify-between text-xs text-gray-300 mt-1">
                          <span>0%</span>
                          <span>40%</span>
                        </div>
                      </div>
                    </div>

                    {/* Scenario Results */}
                    {scenarioResult && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-primary-800 to-primary-700 rounded-xl border-2 border-primary-600">
                        <h3 className="text-xl font-bold text-gray-100 mb-4">Scenario Impact</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {/* Before/After Comparison */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-primary-900/70 rounded-lg border border-primary-600">
                              <span className="text-sm text-gray-300">Current CO₂</span>
                              <span className="font-bold text-gray-100">{result.footprint.totalCO2.toFixed(1)} kg/month</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-900/40 rounded-lg border-2 border-green-500">
                              <span className="text-sm text-green-300 font-semibold">New CO₂</span>
                              <span className="font-bold text-green-300">{scenarioResult.newTotalCO2.toFixed(1)} kg/month</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-primary-800 rounded-lg border border-primary-500">
                              <span className="text-sm text-primary-200 font-semibold">Reduction</span>
                              <span className="font-bold text-primary-200">
                                {scenarioResult.reduction.toFixed(1)} kg ({scenarioResult.reductionPercent}%)
                              </span>
                            </div>
                          </div>

                          {/* Score & Badge */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-primary-900/70 rounded-lg border border-primary-600">
                              <span className="text-sm text-gray-300">Current Score</span>
                              <span className="font-bold text-gray-100">{result.footprint.footprintScore}/100</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-primary-800 rounded-lg border-2 border-primary-400">
                              <span className="text-sm text-primary-200 font-semibold">New Score</span>
                              <span className="font-bold text-primary-200">{scenarioResult.newScore}/100</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-lg border border-yellow-600">
                              <span className="text-sm text-yellow-300 font-semibold">New Badge</span>
                              <span className="font-bold text-yellow-300">{scenarioResult.newBadge}</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Insights */}
                        {scenarioResult.aiInsights && (
                          <div className="mt-4 p-4 bg-primary-900/70 rounded-lg border border-primary-600">
                            <p className="text-xs text-gray-300 mb-2 flex items-center gap-1">
                              <span>✨</span> AI Insights
                            </p>
                            <p className="text-sm text-gray-200 leading-relaxed">{scenarioResult.aiInsights}</p>
                          </div>
                        )}

                        {/* Reset Button */}
                        <button
                          onClick={() => {
                            setScenario({ electricity: 0, water: 0, waste: 0, fuel: 0 });
                            setScenarioResult(null);
                          }}
                          className="mt-4 w-full bg-primary-700 hover:bg-primary-600 text-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Reset Scenario
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {downloading ? "Generating PDF..." : "Download Full Report (PDF)"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push("/analyze")}
            className="btn-secondary"
          >
            Analyze Another Business
          </button>
        </div>
      </div>
    </div>
  );
}

