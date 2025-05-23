import {
  CalculationInput,
  TCOResult,
  OwnershipType,
  YearlyBreakdown,
  CostSummary,
} from "@/types/calculator";
import {
  BASE_COSTS,
  AGE_INSURANCE_MULTIPLIERS,
  LOCATION_MULTIPLIERS,
} from "./nordic-config";

export class TCOCalculator {
  private input: CalculationInput;

  constructor(input: CalculationInput) {
    this.input = input;
  }

  calculate(): TCOResult {
    const { ownershipType } = this.input;
    const yearlyBreakdown = this.calculateYearlyBreakdown();
    const summary = this.calculateSummary(yearlyBreakdown);

    return {
      ownershipType,
      totalCost: summary.netTotalCost,
      yearlyBreakdown,
      summary,
    };
  }

  private calculateYearlyBreakdown(): YearlyBreakdown[] {
    const { formData } = this.input;
    const years = formData.period.years;
    const breakdown: YearlyBreakdown[] = [];
    let cumulativeCost = 0;

    for (let year = 1; year <= years; year++) {
      const initialCosts = year === 1 ? this.calculateInitialCosts() : 0;
      const monthlyPayments = this.calculateMonthlyPayments(year);
      const operatingCosts = this.calculateOperatingCosts();
      const maintenanceCosts = this.calculateMaintenanceCosts(year);
      const insuranceCosts = this.calculateInsuranceCosts(year);
      const depreciationCosts = this.calculateDepreciationCosts(year);

      const totalYearCost =
        initialCosts +
        monthlyPayments +
        operatingCosts +
        maintenanceCosts +
        insuranceCosts +
        depreciationCosts;

      cumulativeCost += totalYearCost;

      breakdown.push({
        year,
        initialCosts,
        monthlyPayments,
        operatingCosts,
        maintenanceCosts,
        insuranceCosts,
        depreciationCosts,
        totalYearCost,
        cumulativeCost,
      });
    }

    return breakdown;
  }

  private calculateInitialCosts(): number {
    const { formData, ownershipType, countryConfig } = this.input;
    const { vehicle, purchase, lease } = formData;

    let initialCosts = 0;

    switch (ownershipType) {
      case "purchase":
        // Down payment + registration + VAT
        initialCosts = purchase.downPayment;
        initialCosts += vehicle.purchasePrice * countryConfig.registrationTax;
        if (vehicle.fuelType !== "electric") {
          initialCosts += vehicle.purchasePrice * countryConfig.vatRate;
        } else {
          // Apply EV incentive
          const discountedVAT =
            countryConfig.vatRate *
            (1 - countryConfig.electricVehicleIncentive);
          initialCosts += vehicle.purchasePrice * discountedVAT;
        }
        break;

      case "finance":
        // Down payment + registration + VAT (same as purchase but with financing)
        initialCosts = purchase.downPayment;
        initialCosts += vehicle.purchasePrice * countryConfig.registrationTax;
        if (vehicle.fuelType !== "electric") {
          initialCosts += vehicle.purchasePrice * countryConfig.vatRate;
        } else {
          const discountedVAT =
            countryConfig.vatRate *
            (1 - countryConfig.electricVehicleIncentive);
          initialCosts += vehicle.purchasePrice * discountedVAT;
        }
        break;

      case "lease":
        // Lease down payment + first month
        initialCosts = lease.downPayment + lease.monthlyPayment;
        break;
    }

    // Add winter equipment costs if required
    if (countryConfig.winterTireRequirement) {
      initialCosts += BASE_COSTS.winterEquipment.tires;
    }

    return initialCosts;
  }

  private calculateMonthlyPayments(year: number): number {
    const { formData, ownershipType } = this.input;
    const { purchase, lease } = formData;

    switch (ownershipType) {
      case "purchase":
        return 0; // No monthly payments for cash purchase

      case "finance":
        if (
          !purchase.financingRequired ||
          !purchase.loanTermYears ||
          !purchase.interestRate
        ) {
          return 0;
        }
        // Calculate loan payments
        const principal = formData.vehicle.purchasePrice - purchase.downPayment;
        const monthlyRate = purchase.interestRate / 12 / 100;
        const totalMonths = purchase.loanTermYears * 12;

        if (year > purchase.loanTermYears) return 0;

        const monthlyPayment =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

        return monthlyPayment * 12;

      case "lease":
        const leaseTermYears = lease.leaseTerm / 12;
        if (year > leaseTermYears) return 0;

        // Account for potential excess mileage
        const annualMileage = formData.vehicle.estimatedAnnualMileage;
        let excessCost = 0;
        if (annualMileage > lease.annualMileageLimit) {
          const excessKm = annualMileage - lease.annualMileageLimit;
          excessCost = excessKm * lease.excessMileageFee;
        }

        return lease.monthlyPayment * 12 + excessCost;
    }
  }

  private calculateOperatingCosts(): number {
    const { formData, countryConfig } = this.input;
    const { vehicle } = formData;

    let fuelCost = 0;
    const annualMileage = vehicle.estimatedAnnualMileage;

    if (vehicle.fuelType === "electric") {
      // Electric vehicle costs
      const energyConsumption = (vehicle.fuelConsumption / 100) * annualMileage; // kWh per year
      fuelCost = energyConsumption * countryConfig.averageElectricityPrice;
    } else {
      // ICE vehicle costs
      const fuelConsumption = (vehicle.fuelConsumption / 100) * annualMileage; // liters per year
      fuelCost = fuelConsumption * countryConfig.averageFuelPrice;
    }

    return fuelCost;
  }

  private calculateMaintenanceCosts(year: number): number {
    const { formData } = this.input;
    const { vehicle, user } = formData;

    const baseCost = BASE_COSTS.maintenance[vehicle.vehicleCategory];
    let annualMaintenance =
      baseCost.annual + baseCost.perKm * vehicle.estimatedAnnualMileage;

    // Apply location multiplier
    annualMaintenance *= LOCATION_MULTIPLIERS[user.location].maintenance;

    // Increase maintenance cost with vehicle age
    const vehicleAge = new Date().getFullYear() - vehicle.year + year - 1;
    const ageMultiplier = 1 + vehicleAge * 0.05; // 5% increase per year
    annualMaintenance *= ageMultiplier;

    // Electric vehicles have lower maintenance costs
    if (vehicle.fuelType === "electric") {
      annualMaintenance *= 0.6; // 40% reduction
    }

    return annualMaintenance;
  }

  private calculateInsuranceCosts(year: number): number {
    const { formData, countryConfig } = this.input;
    const { vehicle, user } = formData;

    let baseCost = BASE_COSTS.insurance[vehicle.vehicleCategory].annual;

    // Apply country multiplier
    baseCost *= countryConfig.averageInsuranceMultiplier;

    // Apply age multiplier
    const ageMultiplier = this.getAgeMultiplier(user.age + year - 1);
    baseCost *= ageMultiplier;

    // Apply location multiplier
    baseCost *= LOCATION_MULTIPLIERS[user.location].insurance;

    // Apply driving experience discount
    const experienceDiscount = Math.min(user.drivingExperience * 0.02, 0.2); // Max 20% discount
    baseCost *= 1 - experienceDiscount;

    return baseCost;
  }

  private calculateDepreciationCosts(year: number): number {
    const { formData, ownershipType } = this.input;
    const { vehicle } = formData;

    // Only apply depreciation for purchase and finance
    if (ownershipType === "lease") return 0;

    const depreciationRates = BASE_COSTS.depreciation[vehicle.vehicleCategory];
    const rate =
      depreciationRates[year - 1] ||
      depreciationRates[depreciationRates.length - 1];

    // Calculate current value
    let currentValue = vehicle.purchasePrice;
    for (let i = 0; i < year - 1; i++) {
      const prevRate =
        depreciationRates[i] || depreciationRates[depreciationRates.length - 1];
      currentValue *= 1 - prevRate;
    }

    return currentValue * rate;
  }

  private calculateSummary(yearlyBreakdown: YearlyBreakdown[]): CostSummary {
    const { formData, ownershipType } = this.input;

    const initialCosts = yearlyBreakdown[0]?.initialCosts || 0;
    const totalMonthlyPayments = yearlyBreakdown.reduce(
      (sum, year) => sum + year.monthlyPayments,
      0
    );
    const totalOperatingCosts = yearlyBreakdown.reduce(
      (sum, year) => sum + year.operatingCosts,
      0
    );
    const totalMaintenanceCosts = yearlyBreakdown.reduce(
      (sum, year) => sum + year.maintenanceCosts,
      0
    );
    const totalInsuranceCosts = yearlyBreakdown.reduce(
      (sum, year) => sum + year.insuranceCosts,
      0
    );
    const totalDepreciationCosts = yearlyBreakdown.reduce(
      (sum, year) => sum + year.depreciationCosts,
      0
    );

    let endOfTermValue = 0;

    if (ownershipType === "purchase" || ownershipType === "finance") {
      // Calculate remaining value
      const totalDepreciation = totalDepreciationCosts;
      endOfTermValue = formData.vehicle.purchasePrice - totalDepreciation;
    } else if (ownershipType === "lease") {
      // For lease, no residual value to the user
      endOfTermValue = 0;
    }

    const netTotalCost =
      initialCosts +
      totalMonthlyPayments +
      totalOperatingCosts +
      totalMaintenanceCosts +
      totalInsuranceCosts +
      totalDepreciationCosts -
      endOfTermValue;

    return {
      initialCosts,
      totalMonthlyPayments,
      totalOperatingCosts,
      totalMaintenanceCosts,
      totalInsuranceCosts,
      totalDepreciationCosts,
      endOfTermValue,
      netTotalCost,
    };
  }

  private getAgeMultiplier(age: number): number {
    const ages = Object.keys(AGE_INSURANCE_MULTIPLIERS)
      .map(Number)
      .sort((a, b) => a - b);

    // Find the closest age in our lookup table
    if (age <= ages[0])
      return AGE_INSURANCE_MULTIPLIERS[
        ages[0] as keyof typeof AGE_INSURANCE_MULTIPLIERS
      ];
    if (age >= ages[ages.length - 1])
      return AGE_INSURANCE_MULTIPLIERS[
        ages[ages.length - 1] as keyof typeof AGE_INSURANCE_MULTIPLIERS
      ];

    // Linear interpolation for ages between our data points
    for (let i = 0; i < ages.length - 1; i++) {
      if (age >= ages[i] && age <= ages[i + 1]) {
        const ratio = (age - ages[i]) / (ages[i + 1] - ages[i]);
        const multiplier1 =
          AGE_INSURANCE_MULTIPLIERS[
            ages[i] as keyof typeof AGE_INSURANCE_MULTIPLIERS
          ];
        const multiplier2 =
          AGE_INSURANCE_MULTIPLIERS[
            ages[i + 1] as keyof typeof AGE_INSURANCE_MULTIPLIERS
          ];
        return multiplier1 + ratio * (multiplier2 - multiplier1);
      }
    }

    return 1.0; // Fallback
  }
}

export function calculateTCO(input: CalculationInput): TCOResult {
  const calculator = new TCOCalculator(input);
  return calculator.calculate();
}

export function calculateAllOwnershipTypes(
  formData: CalculationInput["formData"],
  countryConfig: CalculationInput["countryConfig"]
): Record<OwnershipType, TCOResult> {
  const ownershipTypes: OwnershipType[] = ["purchase", "finance", "lease"];
  const results: Record<OwnershipType, TCOResult> = {} as Record<
    OwnershipType,
    TCOResult
  >;

  ownershipTypes.forEach((ownershipType) => {
    const input: CalculationInput = {
      formData,
      ownershipType,
      countryConfig,
    };
    results[ownershipType] = calculateTCO(input);
  });

  return results;
}
