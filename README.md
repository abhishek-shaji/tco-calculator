# Nordic Car Purchase Calculator (Hackathon Version)

A simplified Total Cost of Ownership (TCO) calculator designed for hackathon demos. This application shows a car advertisement alongside a calculator that helps users understand the financial implications of purchasing, financing, or leasing the vehicle.

## 🌟 Features

### Simplified Interface

- **Car Advertisement**: Hardcoded vehicle details displayed like a Blocket listing
- **Quick Calculator**: Only asks for essential inputs - years, mileage, and trade-in value
- **Instant Results**: Real-time calculations with immediate comparison
- **Three Options**: Purchase vs Finance vs Lease comparison
- **Swedish Market**: Pre-configured for Swedish market conditions

### Core Functionality

- **Real-time Calculations**: Updates instantly as you change inputs
- **Best Option Recommendation**: Automatically highlights the most cost-effective choice
- **Interactive Charts**: Visual comparison of total costs
- **PDF Export**: Generate detailed reports for offline analysis
- **Mobile Responsive**: Works on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tco-calculator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 How to Use

### Simple 3-Step Process

1. **View the Car**: Pre-loaded Volvo XC60 details on the left side
2. **Enter Your Requirements**:
   - Years you plan to own the vehicle (1-5 years)
   - Total mileage you expect to drive
   - Trade-in value of your current car (if any)
3. **See Results**: Instant comparison of purchase, finance, and lease options

### Example Usage

**Default Settings:**

- Vehicle: 2023 Volvo XC60 T6 AWD Inscription
- Price: 649,000 SEK
- Years: 3 years
- Total Mileage: 45,000 km (15,000 km/year)
- Trade-in: 0 SEK

**Results typically show:**

- **Purchase**: ~580,000 SEK total cost
- **Finance**: ~620,000 SEK total cost
- **Lease**: ~595,000 SEK total cost

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page with two-column layout
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── calculator/
│       ├── car-ad.tsx        # Car advertisement component
│       └── simple-tco-calculator.tsx  # Simplified calculator
├── lib/
│   ├── calculator.ts         # Core TCO calculation engine
│   ├── nordic-config.ts      # Nordic country configurations
│   └── utils.ts              # General utilities
└── types/
    └── calculator.ts         # TypeScript type definitions
```

## 🧮 Calculation Details

### Hardcoded Vehicle Data

- **Make/Model**: Volvo XC60 T6 AWD Inscription
- **Year**: 2023
- **Price**: 649,000 SEK
- **Fuel Type**: Petrol
- **Consumption**: 8.2L/100km
- **Category**: SUV

### Fixed Assumptions (Swedish Market)

- **Country**: Sweden (25% VAT, 7.6% registration tax)
- **User Profile**: 35 years old, suburban location, has garage
- **Finance Rate**: 4.5% APR
- **Down Payment**: 20% for purchase/finance, 10% for lease
- **Lease Terms**: Competitive Swedish market rates

### Cost Components Calculated

1. **Initial Costs**: Down payment, taxes, registration
2. **Monthly Payments**: Loan or lease payments
3. **Operating Costs**: Fuel based on usage
4. **Maintenance**: Age and mileage-based increases
5. **Insurance**: Age and location adjusted
6. **Depreciation**: Category-specific rates (purchase/finance only)

## 🛠️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Build Tool**: Turbopack

## 🎯 Hackathon Benefits

### Quick Demo Features

- **No Complex Forms**: Just 3 simple inputs
- **Instant Results**: No waiting for calculations
- **Visual Impact**: Car ad + charts make great demo visuals
- **Real Data**: Uses actual Nordic market calculations
- **Professional Look**: Polished UI that looks production-ready

### Customization for Other Vehicles

To change the vehicle being advertised:

1. **Update Car Data** in `src/components/calculator/car-ad.tsx`:

   ```typescript
   const carData = {
     make: "Your Brand",
     model: "Your Model",
     year: 2024,
     price: 500000, // SEK
     // ... other details
   };
   ```

2. **Adjust Vehicle Category** in `simple-tco-calculator.tsx`:
   ```typescript
   vehicleCategory: 'sedan', // compact, sedan, suv, luxury
   ```

## 🚧 Future Enhancements

### Phase 2 (Post-Hackathon)

- **Multiple Vehicles**: Support for different car models
- **Country Selection**: Support for Norway, Denmark, Finland
- **User Profiles**: Age and location selection
- **Advanced Options**: Custom down payments, interest rates
- **Comparison Tool**: Side-by-side vehicle comparisons

### Integration Opportunities

- **Blocket Integration**: Pull real vehicle data from listings
- **Finance Partners**: Real-time loan and lease quotes
- **Insurance APIs**: Actual insurance pricing
- **Dealer Networks**: Direct contact with sellers

## 📄 License

MIT License - see LICENSE file for details.

---

**Perfect for Hackathons** 🏆  
_Ready-to-demo Nordic car purchase calculator with real market data_
