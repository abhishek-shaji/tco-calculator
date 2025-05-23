export type NordicCountry = "sweden" | "norway" | "denmark" | "finland";

export type OwnershipType = "purchase" | "finance" | "lease";

export interface CountryConfig {
  name: string;
  vatRate: number;
  registrationTax: number;
  averageFuelPrice: number; // per liter
  averageElectricityPrice: number; // per kWh
  averageInsuranceMultiplier: number;
  winterTireRequirement: boolean;
  electricVehicleIncentive: number; // as percentage
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  purchasePrice: number;
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  fuelConsumption: number; // L/100km for ICE, kWh/100km for electric
  estimatedAnnualMileage: number;
  vehicleCategory: "compact" | "sedan" | "suv" | "luxury";
}

export interface PurchaseData {
  downPayment: number;
  tradeInValue: number;
  financingRequired: boolean;
  loanTermYears?: number;
  interestRate?: number;
}

export interface LeaseData {
  monthlyPayment: number;
  downPayment: number;
  leaseTerm: number; // months
  annualMileageLimit: number;
  excessMileageFee: number; // per km
  residualValue: number;
}

export interface UserProfile {
  country: NordicCountry;
  age: number;
  drivingExperience: number;
  location: "urban" | "suburban" | "rural";
  hasGarage: boolean;
}

export interface CalculationPeriod {
  years: number; // 1-5 years
}

export interface TCOResult {
  ownershipType: OwnershipType;
  totalCost: number;
  yearlyBreakdown: YearlyBreakdown[];
  summary: CostSummary;
}

export interface YearlyBreakdown {
  year: number;
  initialCosts: number;
  monthlyPayments: number;
  operatingCosts: number;
  maintenanceCosts: number;
  insuranceCosts: number;
  depreciationCosts: number;
  totalYearCost: number;
  cumulativeCost: number;
}

export interface CostSummary {
  initialCosts: number;
  totalMonthlyPayments: number;
  totalOperatingCosts: number;
  totalMaintenanceCosts: number;
  totalInsuranceCosts: number;
  totalDepreciationCosts: number;
  endOfTermValue: number;
  netTotalCost: number;
}

export interface FormData {
  vehicle: VehicleData;
  purchase: PurchaseData;
  lease: LeaseData;
  user: UserProfile;
  period: CalculationPeriod;
}

export interface CalculationInput {
  formData: FormData;
  ownershipType: OwnershipType;
  countryConfig: CountryConfig;
}
