"use client";

import { useRouter } from "next/navigation";
import { Leaf, Zap, TrendingUp, Shield, BarChart3, Calculator, Gift, Sliders } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-2xl -z-10"></div>
                <Leaf className="w-14 h-14 text-primary-600 drop-shadow-lg" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 bg-clip-text text-transparent">
                GreenTrack
              </h1>
            </div>
            <p className="text-lg text-primary-300 font-medium">
              Tracking sustainability
            </p>
          </div>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Transform your business with AI-powered sustainability insights. 
            Reduce your carbon footprint, cut costs, and build a greener future.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="card text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300 shadow-md">
              <Zap className="w-8 h-8 text-primary-200" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">AI-Powered Analysis</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Smart recommendations to reduce energy consumption and waste
            </p>
          </div>
          <div className="card text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300 shadow-md">
              <BarChart3 className="w-8 h-8 text-primary-200" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">Industry Benchmarks</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Compare your emissions against similar businesses
            </p>
          </div>
          <div className="card text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300 shadow-md">
              <Calculator className="w-8 h-8 text-primary-200" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">ROI Calculator</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              See how quickly sustainability investments pay off
            </p>
          </div>
          <div className="card text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300 shadow-md">
              <Gift className="w-8 h-8 text-primary-200" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">Incentive Finder</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover eligible government subsidies and grants
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="card text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300 shadow-md">
              <Sliders className="w-8 h-8 text-primary-200" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">Scenario Simulator</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Test different reduction scenarios and see real-time impact on your carbon footprint
            </p>
          </div>
          <div className="card text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300 shadow-md">
              <TrendingUp className="w-8 h-8 text-primary-200" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">Cost Savings Forecast</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get detailed monthly and yearly savings estimates
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12">
          <button
            onClick={() => router.push("/analyze")}
            className="btn-primary text-lg px-8 py-4"
          >
            Analyze Your Business →
          </button>
        </div>

        {/* How It Works */}
        <div className="mt-16 space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-3 card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mx-auto shadow-lg">
                1
              </div>
              <h3 className="font-semibold text-lg text-gray-100">Enter Business Info</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tell us about your business type and usage
              </p>
            </div>
            <div className="space-y-3 card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-400 text-white rounded-2xl flex items-center justify-center font-bold text-xl mx-auto shadow-lg">
                2
              </div>
              <h3 className="font-semibold text-lg text-gray-100">AI Analysis</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our AI analyzes your data and generates insights
              </p>
            </div>
            <div className="space-y-3 card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-400 text-white rounded-2xl flex items-center justify-center font-bold text-xl mx-auto shadow-lg">
                3
              </div>
              <h3 className="font-semibold text-lg text-gray-100">Get Comprehensive Insights</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Receive actionable plans, benchmarks, ROI calculations, incentives, and scenario simulations
              </p>
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mt-16 space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent text-center">
            Why Choose GreenTrack?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="card">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-lg text-gray-100 mb-2">Industry Benchmarks</h3>
              <p className="text-gray-300 text-sm">
                Compare your carbon footprint with similar businesses. Know if you're above or below industry average.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold text-lg text-gray-100 mb-2">ROI Calculator</h3>
              <p className="text-gray-300 text-sm">
                See upfront costs, monthly savings, and ROI timeline for each sustainability action. Make informed decisions.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-semibold text-lg text-gray-100 mb-2">Government Incentives</h3>
              <p className="text-gray-300 text-sm">
                Discover eligible subsidies, grants, and tax incentives that can help fund your green initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

