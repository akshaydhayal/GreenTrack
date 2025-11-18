"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Leaf, TrendingDown, DollarSign, Award } from "lucide-react";
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
  };
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
    if (score < 20) return "text-green-600";
    if (score < 40) return "text-primary-600";
    if (score < 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score < 20) return "Excellent";
    if (score < 40) return "Good";
    if (score < 60) return "Moderate";
    return "Poor";
  };

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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Analyzing your business...</p>
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
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div id="report-content" className="space-y-8">
          {/* Header */}
          <div className="card text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Sustainability Report
            </h1>
            <p className="text-gray-600">
              {result.businessData.businessType} • {result.businessData.employees} Employees
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Carbon Score */}
            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingDown className="w-8 h-8 text-primary-600" />
              </div>
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.footprint.footprintScore)}`}>
                {result.footprint.footprintScore}
              </div>
              <div className="text-gray-600 font-semibold mb-1">Carbon Footprint Score</div>
              <div className={`text-sm font-medium ${getScoreColor(result.footprint.footprintScore)}`}>
                {getScoreLabel(result.footprint.footprintScore)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {result.footprint.totalCO2.toFixed(1)} kg CO₂/month
              </div>
            </div>

            {/* Cost Savings */}
            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {result.recommendations.costSavings.monthly}
              </div>
              <div className="text-gray-600 font-semibold mb-1">Monthly Savings</div>
              <div className="text-sm text-gray-500">
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
              <div className="text-gray-600 font-semibold mb-1">Achievement Badge</div>
              <div className="text-sm text-gray-500">
                {result.recommendations.reductionPotential}% reduction potential
              </div>
            </div>
          </div>

          {/* Carbon Breakdown Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Carbon Footprint Breakdown</h2>
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

          {/* Energy Recommendations */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary-600" />
              Energy Optimization Recommendations
            </h2>
            <div className="space-y-4">
              {result.recommendations.energy.map((rec, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4 py-2 bg-primary-50 rounded-r-lg">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{rec.title}</h3>
                  <p className="text-gray-700 mb-2">{rec.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600 font-semibold">💰 {rec.savings}</span>
                    <span className="text-primary-600 font-semibold">🌱 {rec.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waste Recommendations */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Waste Reduction Recommendations
            </h2>
            <div className="space-y-4">
              {result.recommendations.waste.map((rec, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{rec.title}</h3>
                  <p className="text-gray-700 mb-2">{rec.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600 font-semibold">💰 {rec.savings}</span>
                    <span className="text-primary-600 font-semibold">🌱 {rec.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Savings Breakdown */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Savings Forecast</h2>
            <div className="bg-gradient-to-r from-green-50 to-primary-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">{result.recommendations.costSavings.breakdown}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Monthly Savings</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.recommendations.costSavings.monthly}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Yearly Savings</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {result.recommendations.costSavings.yearly}
                  </div>
                </div>
              </div>
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

