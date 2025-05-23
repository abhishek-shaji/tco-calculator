"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Fuel, Calendar, Settings, Zap } from "lucide-react";

// Hardcoded car data - this would come from the ad in a real scenario
const carData = {
  make: "Volvo",
  model: "XC60 T6 AWD Inscription",
  year: 2023,
  price: 649000, // SEK
  mileage: 12500,
  fuelType: "Petrol",
  transmission: "Automatic",
  power: "310 hp",
  fuelConsumption: 8.2, // L/100km
  color: "Crystal White",
  features: [
    "Panoramic Sunroof",
    "Harman Kardon Sound",
    "Air Suspension",
    "Pilot Assist",
    "Heated Seats",
    "LED Headlights",
  ],
  description:
    "Beautiful Volvo XC60 in excellent condition. Well maintained with full service history. Perfect family SUV with advanced safety features and premium comfort.",
  images: [
    "/api/placeholder/400/300", // These would be real image URLs
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
  ],
};

export function CarAd() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("sv-SE").format(price) + " kr";
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("sv-SE").format(mileage) + " mil";
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              {carData.make} {carData.model}
            </CardTitle>
            <p className="text-muted-foreground">{carData.year}</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {formatPrice(carData.price)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Image */}
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <Car className="w-16 h-16 text-gray-400" />
          <span className="ml-2 text-gray-500">Car Image</span>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>{carData.year}</strong> • {formatMileage(carData.mileage)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Fuel className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>{carData.fuelType}</strong> • {carData.fuelConsumption}
              L/100km
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>{carData.transmission}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>{carData.power}</strong>
            </span>
          </div>
        </div>

        {/* Color */}
        <div>
          <h4 className="font-semibold mb-2">Color</h4>
          <p className="text-sm text-muted-foreground">{carData.color}</p>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold mb-3">Features</h4>
          <div className="flex flex-wrap gap-2">
            {carData.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {carData.description}
          </p>
        </div>

        {/* Contact Info Placeholder */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Premium Auto Stockholm</p>
              <p className="text-sm text-muted-foreground">Verified Dealer</p>
            </div>
            <Badge variant="default">Premium</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export the car data for use in calculations
export { carData };
