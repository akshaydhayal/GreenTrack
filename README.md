<<<<<<< HEAD
# GreenTrack 🌱

**Tracking sustainability**

An AI-powered tool that helps small businesses track and reduce their carbon footprint while saving money through intelligent sustainability recommendations.

Built for the **GEF2025 Hackathon: The AI-Powered Entrepreneur - Protecting the Future**

## ✨ Features

### Core Features
- 📊 **Business Sustainability Analysis** - Comprehensive carbon footprint calculation
- 💡 **AI-Generated Recommendations** - Personalized energy and waste reduction strategies powered by Google Gemini
- 💰 **Cost-Saving Forecasts** - Monthly and yearly savings estimates
- 🌱 **Carbon Footprint Scoring** - Visual score from 0-100 with color-coded ratings
- 🏆 **Achievement Badge System** - Bronze, Silver, Gold, and Platinum badges
- 📈 **Interactive Charts** - Visual breakdown of carbon emissions by source
- 📄 **Downloadable PDF Reports** - Professional reports for presentations
- 🎨 **Dark Green Eco Theme** - Beautiful, modern dark green UI with excellent contrast

### New Advanced Features
- 📊 **Industry Benchmarks** - Compare your business emissions against industry averages. See if you're performing above or below similar businesses in your sector.
- 💵 **ROI Calculator** - Calculate return on investment for each sustainability action. See upfront costs, monthly savings, and payback periods to prioritize investments.
- 🎁 **Incentive Finder** - Discover eligible government subsidies, grants, and tax incentives. Get direct links to application pages for solar, energy efficiency, waste management, and more.
- 🎛️ **CO₂ Reduction Scenario Simulator** - Interactive sliders to test different reduction scenarios. See real-time impact on carbon footprint, score, badge, and savings. Get AI-powered insights for each scenario.

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

3. **View Comprehensive Results**
   - See your carbon footprint score and breakdown
   - Review actionable recommendations with ROI calculations
   - Compare your emissions with industry benchmarks
   - Discover eligible government incentives and subsidies
   - Test different reduction scenarios with the interactive simulator
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
  ├── page.tsx                    # Landing page with features overview
  ├── analyze/page.tsx            # Multi-step business input form
  ├── results/page.tsx            # Results dashboard with tabbed interface
  ├── api/
  │   ├── analyze/route.ts        # AI analysis API endpoint (consolidated)
  │   └── scenario-insights/      # AI insights for scenario simulator
  ├── data/
  │   ├── benchmarks.json         # Fallback benchmark data
  │   └── roi-data.json           # Fallback ROI data
  ├── layout.tsx                  # Root layout
  └── globals.css                 # Global styles and dark green theme
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

### AI-Powered Recommendations
The system uses Google Gemini AI to provide:
- Energy optimization strategies
- Waste reduction plans
- Cost-saving opportunities
- Environmental impact estimates
- Industry-specific insights

### Industry Benchmarks
- Compares your monthly CO₂ emissions with industry averages
- Based on business type and employee count
- Shows percentage difference (above/below average)
- Provides context about typical emissions for your sector
- AI-generated benchmarks for accurate comparisons

### ROI Calculator
- Shows upfront investment cost for each recommendation
- Calculates monthly savings potential
- Displays ROI timeline (months to break even)
- Highlights "Fast ROI" actions (under 6 months)
- Helps prioritize investments based on financial returns

### Incentive Finder
- Identifies eligible government programs and subsidies
- Covers solar, energy efficiency, waste management, and tax incentives
- Provides eligibility requirements and estimated value
- Direct links to official application pages
- AI-powered discovery of relevant incentives

### Scenario Simulator
- Interactive sliders for electricity, water, waste, and fuel reductions
- Real-time calculation of new carbon footprint and score
- Shows potential badge upgrades
- Displays CO₂ reduction in kg and percentage
- AI-generated insights for each scenario
- Helps visualize impact before implementing changes

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📝 Notes

- No database required - uses browser sessionStorage
- Works offline with fallback recommendations and data
- AI requests are consolidated into a single API call for efficiency
- Currency symbols can be customized in the code
- All calculations use metric units (kg, kWh, liters)
- Dark green eco-friendly theme throughout
- Tabbed interface for organized results viewing
- All features work with or without API key (using intelligent fallbacks)

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Built with ❤️ for a sustainable future**

=======
# GreenTrack 🌱

**Tracking sustainability**

An AI-powered tool that helps small businesses track and reduce their carbon footprint while saving money through intelligent sustainability recommendations.

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

>>>>>>> ecfd585949ee2b6ad491da616ffcfe0ecb9ac62f
