"use client";

import { useRouter } from "next/navigation";
import { Leaf, Zap, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Leaf className="w-12 h-12 text-primary-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              GreenAI Business Optimizer
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your business with AI-powered sustainability insights. 
            Reduce your carbon footprint, cut costs, and build a greener future.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="card text-center">
            <Zap className="w-10 h-10 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Energy Optimization</h3>
            <p className="text-gray-600 text-sm">
              Smart recommendations to reduce energy consumption
            </p>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-10 h-10 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Cost Savings</h3>
            <p className="text-gray-600 text-sm">
              Discover opportunities to save money monthly
            </p>
          </div>
          <div className="card text-center">
            <Leaf className="w-10 h-10 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Carbon Tracking</h3>
            <p className="text-gray-600 text-sm">
              Understand and reduce your environmental impact
            </p>
          </div>
          <div className="card text-center">
            <Shield className="w-10 h-10 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Future-Proof</h3>
            <p className="text-gray-600 text-sm">
              Build a sustainable business for tomorrow
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
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="font-semibold text-lg">Enter Business Info</h3>
              <p className="text-gray-600 text-sm">
                Tell us about your business type and usage
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="font-semibold text-lg">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Our AI analyzes your data and generates insights
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="font-semibold text-lg">Get Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Receive actionable plans to go green and save money
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

