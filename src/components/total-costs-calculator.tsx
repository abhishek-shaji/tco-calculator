"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calculator } from "lucide-react";
import { carData } from "./car-ad";

interface SimpleInputs {
  years: number;
  totalMileage: number;
  tradeInValue: number;
  downPayment: number;
}

interface TCOResult {
  ownershipType: string;
  initialCosts: number;
  monthlyPayments: number;
  vehicleTax: number;
  maintenance: number;
  insurance: number;
  endValue: number;
  netTotalCost: number;
}

const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const TotalCostsCalculator = () => {
  const [inputs, setInputs] = useState<SimpleInputs>({
    years: 3,
    totalMileage: 45000, // 15k per year default
    tradeInValue: 0,
    downPayment: 100000, // Default downpayment
  });

  const [results, setResults] = useState<Record<string, TCOResult> | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("purchase");

  const calculateTCO = useCallback(() => {
    try {
      const carPrice = carData.price;

      // Calculate total costs over the period (no yearly loops needed)
      const totalInsurance = carPrice * 0.04 * inputs.years; // 4% per year
      const totalMaintenance = carPrice * 0.017 * inputs.years; // 1.7% per year
      const totalVehicleTax = carPrice * 0.01 * inputs.years; // 1% per year

      const results: Record<string, TCOResult> = {};

      // PURCHASE OPTION
      const purchaseInitialCost = carPrice - inputs.tradeInValue;
      const purchaseEndValue = carPrice * 0.6; // 60% retention after depreciation

      results.purchase = {
        ownershipType: "purchase",
        initialCosts: purchaseInitialCost,
        monthlyPayments: 0,
        vehicleTax: totalVehicleTax,
        maintenance: totalMaintenance,
        insurance: totalInsurance,
        endValue: purchaseEndValue,
        netTotalCost:
          purchaseInitialCost +
          totalVehicleTax +
          totalMaintenance +
          totalInsurance -
          purchaseEndValue,
      };

      // FINANCE OPTION
      const loanPrincipal = carPrice - inputs.downPayment - inputs.tradeInValue;
      const monthlyInterestRate = 0.045 / 12; // 4.5% annual rate
      const totalMonths = inputs.years * 12;
      const monthlyPayment =
        loanPrincipal > 0
          ? (loanPrincipal *
              monthlyInterestRate *
              Math.pow(1 + monthlyInterestRate, totalMonths)) /
            (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
          : 0;
      const totalLoanPayments = monthlyPayment * totalMonths;

      results.finance = {
        ownershipType: "finance",
        initialCosts: inputs.downPayment,
        monthlyPayments: totalLoanPayments,
        vehicleTax: totalVehicleTax,
        maintenance: totalMaintenance,
        insurance: totalInsurance,
        endValue: purchaseEndValue, // Same as purchase since you own the car after loan completion
        netTotalCost:
          inputs.downPayment +
          totalLoanPayments +
          totalVehicleTax +
          totalMaintenance +
          totalInsurance -
          purchaseEndValue,
      };

      // LEASE OPTION
      const monthlyLease = carPrice * 0.008; // 0.8% of car value per month
      const totalLeasePayments = monthlyLease * totalMonths;
      const leaseMaintenanceCost = totalMaintenance * 0.5; // Reduced maintenance for lease

      results.lease = {
        ownershipType: "lease",
        initialCosts: inputs.downPayment,
        monthlyPayments: totalLeasePayments,
        vehicleTax: totalVehicleTax,
        maintenance: leaseMaintenanceCost,
        insurance: totalInsurance,
        endValue: 0, // No residual value for lease
        netTotalCost:
          inputs.downPayment +
          totalLeasePayments +
          totalVehicleTax +
          leaseMaintenanceCost +
          totalInsurance,
      };

      setResults(results);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  }, [inputs]);

  // Calculate TCO whenever inputs change
  useEffect(() => {
    calculateTCO();
  }, [calculateTCO]);

  const handleInputChange = (field: keyof SimpleInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("sv-SE").format(Math.round(value)) + " kr";
  };

  // Prepare chart data
  const chartData = results
    ? Object.entries(results).map(([option, result]) => ({
        option: option.charAt(0).toUpperCase() + option.slice(1),
        totalCost: Math.round(result.netTotalCost),
        monthlyAverage: Math.round(result.netTotalCost / (inputs.years * 12)),
      }))
    : [];

  // Prepare cost breakdown pie chart data for each option
  const getPieChartData = (result: TCOResult) =>
    [
      {
        name: "Initial Costs",
        value: result.initialCosts,
        color: CHART_COLORS[0],
      },
      {
        name: "Monthly Payments",
        value: result.monthlyPayments,
        color: CHART_COLORS[1],
      },
      {
        name: "Vehicle Tax (1%)",
        value: result.vehicleTax,
        color: CHART_COLORS[2],
      },
      {
        name: "Maintenance",
        value: result.maintenance,
        color: CHART_COLORS[3],
      },
      {
        name: "Insurance (4%)",
        value: result.insurance,
        color: CHART_COLORS[4],
      },
    ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Calculator Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>TCO Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="years">Years to Own</Label>
              <Input
                id="years"
                type="number"
                min="1"
                max="5"
                value={inputs.years}
                onChange={(e) =>
                  handleInputChange("years", parseInt(e.target.value) || 1)
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="mileage">Total Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                min="1000"
                max="500000"
                value={inputs.totalMileage}
                onChange={(e) =>
                  handleInputChange(
                    "totalMileage",
                    parseInt(e.target.value) || 0
                  )
                }
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(
                  inputs.totalMileage / inputs.years
                ).toLocaleString()}{" "}
                km/year
              </p>
            </div>

            <div>
              <Label htmlFor="downpayment">Down Payment (kr)</Label>
              <Input
                id="downpayment"
                type="number"
                min="0"
                value={inputs.downPayment}
                onChange={(e) =>
                  handleInputChange(
                    "downPayment",
                    parseInt(e.target.value) || 0
                  )
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tradein">Trade-in Value (kr)</Label>
              <Input
                id="tradein"
                type="number"
                min="0"
                value={inputs.tradeInValue}
                onChange={(e) =>
                  handleInputChange(
                    "tradeInValue",
                    parseInt(e.target.value) || 0
                  )
                }
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Individual Option Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="purchase">Purchase</TabsTrigger>
              <TabsTrigger value="finance">Loan</TabsTrigger>
              <TabsTrigger value="lease">Lease</TabsTrigger>
            </TabsList>

            {/* Purchase Tab */}
            <TabsContent value="purchase" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Net Total Cost:{" "}
                    {formatCurrency(results.purchase.netTotalCost)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: "Initial Costs",
                      value: results.purchase.initialCosts,
                    },
                    {
                      label: "Vehicle Tax (1%)",
                      value: results.purchase.vehicleTax,
                    },
                    {
                      label: "Maintenance (1.7%)",
                      value: results.purchase.maintenance,
                    },
                    {
                      label: "Insurance (4%)",
                      value: results.purchase.insurance,
                    },
                    {
                      label: "Car End Value",
                      value: results.purchase.endValue,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Monthly Net Total</span>
                      <span>
                        {formatCurrency(
                          results.purchase.netTotalCost / (inputs.years * 12)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Net Total</span>
                      <span>
                        {formatCurrency(results.purchase.netTotalCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={getPieChartData(results.purchase)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData(results.purchase).map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Finance Tab */}
            <TabsContent value="finance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Finance Details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Net Total Cost:{" "}
                    {formatCurrency(results.finance.netTotalCost)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: "Down Payment",
                      value: results.finance.initialCosts,
                    },
                    {
                      label: "Monthly Installment",
                      value:
                        results.finance.monthlyPayments / (inputs.years * 12),
                    },
                    {
                      label: "Loan Payments",
                      value: results.finance.monthlyPayments,
                    },
                    {
                      label: "Vehicle Tax (1%)",
                      value: results.finance.vehicleTax,
                    },
                    {
                      label: "Maintenance (1.7%)",
                      value: results.finance.maintenance,
                    },
                    {
                      label: "Insurance (4%)",
                      value: results.finance.insurance,
                    },
                    { label: "Car End Value", value: results.finance.endValue },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Monthly Net Total</span>
                      <span>
                        {formatCurrency(
                          results.finance.netTotalCost / (inputs.years * 12)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Net Total</span>
                      <span>
                        {formatCurrency(results.finance.netTotalCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Finance Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={getPieChartData(results.finance)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData(results.finance).map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lease Tab */}
            <TabsContent value="lease" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lease Details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Net Total Cost: {formatCurrency(results.lease.netTotalCost)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: "Down Payment",
                      value: results.lease.initialCosts,
                    },
                    {
                      label: "Lease Payments",
                      value: results.lease.monthlyPayments,
                    },
                    {
                      label: "Vehicle Tax (1%)",
                      value: results.lease.vehicleTax,
                    },
                    {
                      label: "Maintenance (0.85%)",
                      value: results.lease.maintenance,
                    },
                    { label: "Insurance (4%)", value: results.lease.insurance },
                    { label: "Car End Value", value: results.lease.endValue },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Monthly Net Total</span>
                      <span>
                        {formatCurrency(
                          results.lease.netTotalCost / (inputs.years * 12)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Net Total</span>
                      <span>{formatCurrency(results.lease.netTotalCost)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Lease Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={getPieChartData(results.lease)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData(results.lease).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Comparison Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Net Total Cost Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare all options side by side (after considering residual
                value)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="option" />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="totalCost" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export { TotalCostsCalculator };
