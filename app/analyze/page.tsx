"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BusinessData {
  businessType: string;
  employees: string;
  yearlyRevenue: string;
  electricityUsage: string;
  waterUsage: string;
  wasteGenerated: string;
  fuelUsed: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BusinessData>({
    businessType: "",
    employees: "",
    yearlyRevenue: "",
    electricityUsage: "",
    waterUsage: "",
    wasteGenerated: "",
    fuelUsed: "",
  });

  const businessTypes = [
    "Restaurant",
    "Retail Shop",
    "Small Farm",
    "Small Factory",
    "Office",
    "Warehouse",
    "Other",
  ];

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store data in sessionStorage
    sessionStorage.setItem("businessData", JSON.stringify(formData));
    
    // Navigate to results page
    router.push("/results");
  };

  const isStep1Valid = formData.businessType && formData.employees;
  const isStep2Valid = formData.electricityUsage && formData.waterUsage && formData.wasteGenerated;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Information
            </h1>
            <p className="text-gray-600">
              Help us understand your business to provide personalized recommendations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of 2
              </span>
              <span className="text-sm text-gray-500">{(step / 2) * 100}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange("businessType", e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select your business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Employees <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => handleInputChange("employees", e.target.value)}
                    className="input-field"
                    placeholder="e.g., 10"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Yearly Revenue (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.yearlyRevenue}
                    onChange={(e) => handleInputChange("yearlyRevenue", e.target.value)}
                    className="input-field"
                    placeholder="e.g., 500000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This helps us provide more accurate cost-saving estimates
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Electricity Usage (kWh) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.electricityUsage}
                    onChange={(e) => handleInputChange("electricityUsage", e.target.value)}
                    className="input-field"
                    placeholder="e.g., 1500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Water Usage (Liters) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.waterUsage}
                    onChange={(e) => handleInputChange("waterUsage", e.target.value)}
                    className="input-field"
                    placeholder="e.g., 5000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Waste Generated (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.wasteGenerated}
                    onChange={(e) => handleInputChange("wasteGenerated", e.target.value)}
                    className="input-field"
                    placeholder="e.g., 200"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Fuel Used (Liters) - Optional
                  </label>
                  <input
                    type="number"
                    value={formData.fuelUsed}
                    onChange={(e) => handleInputChange("fuelUsed", e.target.value)}
                    className="input-field"
                    placeholder="e.g., 100"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include if your business uses vehicles or generators
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!isStep2Valid}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analyze Business
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

