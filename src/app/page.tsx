import { CarAd } from "@/components/car-ad";
import { TotalCostsCalculator } from "@/components/total-costs-calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Car Purchase Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the total cost of ownership for this vehicle
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Car Ad */}
          <div className="space-y-6">
            <CarAd />
          </div>

          {/* Right Column - Calculator */}
          <div className="space-y-6">
            <TotalCostsCalculator />
          </div>
        </div>
      </div>
    </main>
  );
}
