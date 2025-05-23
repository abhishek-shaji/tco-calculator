import { CountryConfig, NordicCountry } from "@/types/calculator";

export const NORDIC_COUNTRIES: Record<NordicCountry, CountryConfig> = {
  sweden: {
    name: "Sweden",
    vatRate: 0.25, // 25%
    registrationTax: 0.076, // Vehicle tax varies, using average
    averageFuelPrice: 18.5, // SEK per liter (approximate)
    averageElectricityPrice: 2.8, // SEK per kWh
    averageInsuranceMultiplier: 1.0, // Base multiplier
    winterTireRequirement: true,
    electricVehicleIncentive: 0.25, // 25% bonus malus reduction
  },
  norway: {
    name: "Norway",
    vatRate: 0.25, // 25%
    registrationTax: 0.0, // No registration tax for most EVs
    averageFuelPrice: 22.0, // NOK per liter
    averageElectricityPrice: 2.5, // NOK per kWh
    averageInsuranceMultiplier: 1.15, // Higher insurance costs
    winterTireRequirement: true,
    electricVehicleIncentive: 0.35, // Strong EV incentives
  },
  denmark: {
    name: "Denmark",
    vatRate: 0.25, // 25%
    registrationTax: 0.85, // High registration tax up to 85%
    averageFuelPrice: 15.8, // DKK per liter
    averageElectricityPrice: 3.2, // DKK per kWh
    averageInsuranceMultiplier: 0.95,
    winterTireRequirement: false, // Not mandatory
    electricVehicleIncentive: 0.15, // Moderate EV incentives
  },
  finland: {
    name: "Finland",
    vatRate: 0.24, // 24%
    registrationTax: 0.048, // Car tax varies by emissions
    averageFuelPrice: 19.2, // EUR per liter
    averageElectricityPrice: 3.0, // EUR per kWh
    averageInsuranceMultiplier: 0.9,
    winterTireRequirement: true,
    electricVehicleIncentive: 0.2, // EV purchase incentive
  },
};

// Base costs for different vehicle categories (in local currency)
export const BASE_COSTS = {
  maintenance: {
    compact: { annual: 8000, perKm: 0.15 },
    sedan: { annual: 12000, perKm: 0.18 },
    suv: { annual: 15000, perKm: 0.22 },
    luxury: { annual: 25000, perKm: 0.35 },
  },
  insurance: {
    compact: { annual: 8000 },
    sedan: { annual: 12000 },
    suv: { annual: 16000 },
    luxury: { annual: 28000 },
  },
  winterEquipment: {
    tires: 6000, // Cost for winter tires
    storage: 1000, // Annual storage cost if no garage
    installation: 800, // Twice yearly installation
  },
  depreciation: {
    // Yearly depreciation rates by vehicle category
    compact: [0.15, 0.12, 0.1, 0.08, 0.08],
    sedan: [0.18, 0.15, 0.12, 0.1, 0.08],
    suv: [0.16, 0.13, 0.11, 0.09, 0.08],
    luxury: [0.25, 0.2, 0.15, 0.12, 0.1],
  },
};

export const AGE_INSURANCE_MULTIPLIERS = {
  18: 2.5,
  19: 2.3,
  20: 2.1,
  21: 1.9,
  22: 1.7,
  23: 1.5,
  24: 1.4,
  25: 1.2,
  30: 1.0,
  40: 0.9,
  50: 0.85,
  60: 0.9,
  70: 1.1,
} as const;

export const LOCATION_MULTIPLIERS = {
  urban: { insurance: 1.2, maintenance: 1.0 },
  suburban: { insurance: 1.0, maintenance: 1.0 },
  rural: { insurance: 0.8, maintenance: 1.15 },
} as const;
