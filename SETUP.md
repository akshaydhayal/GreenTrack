<<<<<<< HEAD
# Setup Instructions

## Quick Start

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
   
   **Note:** The app will work without an API key using fallback recommendations, but AI-powered insights will be limited.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- ✅ Beautiful, modern UI with TailwindCSS
- ✅ Multi-step business information form
- ✅ AI-powered sustainability recommendations
- ✅ Carbon footprint calculation and scoring
- ✅ Cost savings forecasts
- ✅ Achievement badge system
- ✅ Interactive charts and visualizations
- ✅ PDF report generation
- ✅ No database required (uses session storage)

## Project Structure

```
app/
  ├── page.tsx              # Landing page
  ├── analyze/page.tsx      # Business input form
  ├── results/page.tsx      # Results dashboard
  ├── api/analyze/route.ts  # AI analysis API
  └── globals.css           # Global styles
```

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Google Gemini API** - AI recommendations
- **jsPDF + html2canvas** - PDF generation
- **Lucide React** - Icons

=======
# Setup Instructions

## Quick Start

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
   
   **Note:** The app will work without an API key using fallback recommendations, but AI-powered insights will be limited.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- ✅ Beautiful, modern UI with TailwindCSS
- ✅ Multi-step business information form
- ✅ AI-powered sustainability recommendations
- ✅ Carbon footprint calculation and scoring
- ✅ Cost savings forecasts
- ✅ Achievement badge system
- ✅ Interactive charts and visualizations
- ✅ PDF report generation
- ✅ No database required (uses session storage)

## Project Structure

```
app/
  ├── page.tsx              # Landing page
  ├── analyze/page.tsx      # Business input form
  ├── results/page.tsx      # Results dashboard
  ├── api/analyze/route.ts  # AI analysis API
  └── globals.css           # Global styles
```

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Google Gemini API** - AI recommendations
- **jsPDF + html2canvas** - PDF generation
- **Lucide React** - Icons

>>>>>>> ecfd585949ee2b6ad491da616ffcfe0ecb9ac62f
