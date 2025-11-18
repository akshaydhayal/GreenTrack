# GreenAI Business Optimizer 🌱

An AI-powered tool that helps small businesses reduce their carbon footprint and save money through intelligent sustainability recommendations.

Built for the **GEF2025 Hackathon: The AI-Powered Entrepreneur - Protecting the Future**

## ✨ Features

- 📊 **Business Sustainability Analysis** - Comprehensive carbon footprint calculation
- 💡 **AI-Generated Recommendations** - Personalized energy and waste reduction strategies
- 💰 **Cost-Saving Forecasts** - Monthly and yearly savings estimates
- 🌱 **Carbon Footprint Scoring** - Visual score from 0-100 with color-coded ratings
- 🏆 **Achievement Badge System** - Bronze, Silver, Gold, and Platinum badges
- 📈 **Interactive Charts** - Visual breakdown of carbon emissions by source
- 📄 **Downloadable PDF Reports** - Professional reports for presentations
- 🎨 **Beautiful Modern UI** - Clean, intuitive design with smooth animations

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from: https://aistudio.google.com/apikey
   
   **Note:** The app works without an API key using intelligent fallback recommendations, but AI-powered insights will be more generic.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 How It Works

1. **Enter Business Information**
   - Select business type (Restaurant, Retail, Farm, Factory, etc.)
   - Input number of employees and optional revenue
   - Provide monthly usage data (electricity, water, waste, fuel)

2. **AI Analysis**
   - System calculates carbon footprint using industry-standard emission factors
   - AI generates personalized recommendations based on business type
   - Cost savings are estimated using regional averages

3. **View Results**
   - See your carbon footprint score and breakdown
   - Review actionable recommendations
   - Check potential monthly/yearly savings
   - Earn achievement badges based on reduction potential
   - Download a professional PDF report

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Modern utility-first CSS
- **Google Gemini API** - Gemini 2.5 Flash for intelligent recommendations
- **Recharts** - Beautiful data visualizations
- **jsPDF + html2canvas** - PDF report generation
- **Lucide React** - Modern icon library

## 📁 Project Structure

```
app/
  ├── page.tsx              # Landing page with features overview
  ├── analyze/page.tsx      # Multi-step business input form
  ├── results/page.tsx      # Results dashboard with charts
  ├── api/analyze/route.ts  # AI analysis API endpoint
  ├── layout.tsx            # Root layout
  └── globals.css           # Global styles and animations
```

## 🎯 Key Features Explained

### Carbon Footprint Calculation
Uses industry-standard emission factors:
- Electricity: 0.82 kg CO₂/kWh
- Waste: 1.9 kg CO₂/kg
- Fuel: 2.31 kg CO₂/liter
- Water: 0.0003 kg CO₂/liter

### Badge System
- **Bronze**: 10-20% reduction potential
- **Silver**: 20-30% reduction potential
- **Gold**: 30-50% reduction potential
- **Platinum**: 50%+ reduction potential

### AI Recommendations
The system provides:
- Energy optimization strategies
- Waste reduction plans
- Cost-saving opportunities
- Environmental impact estimates

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📝 Notes

- No database required - uses browser sessionStorage
- Works offline with fallback recommendations
- Currency symbols can be customized in the code
- All calculations use metric units (kg, kWh, liters)

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Built with ❤️ for a sustainable future**

