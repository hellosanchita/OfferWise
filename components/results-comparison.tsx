"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"
import type { JobOffer, CalculationResult } from "../types/offer"
import { Checkbox } from "@/components/ui/checkbox"

interface ResultsComparisonProps {
  offers: JobOffer[]
  results: CalculationResult[]
}

export function ResultsComparison({ offers, results }: ResultsComparisonProps) {
  const [showAdjustedValues, setShowAdjustedValues] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getBestOffer = (field: keyof CalculationResult) => {
    if (results.length === 0) return -1
    let bestIndex = 0
    let bestValue = results[0][field] as number

    for (let i = 1; i < results.length; i++) {
      const currentValue = results[i][field] as number
      if (field === "totalTax" || field === "effectiveTaxRate") {
        // Lower is better for taxes
        if (currentValue < bestValue) {
          bestValue = currentValue
          bestIndex = i
        }
      } else {
        // Higher is better for income
        if (currentValue > bestValue) {
          bestValue = currentValue
          bestIndex = i
        }
      }
    }
    return bestIndex
  }

  const bestNetTakeHome = getBestOffer("netTakeHome")
  const bestAdjustedTakeHome = getBestOffer("adjustedAnnualTakeHome")
  const bestTotalComp = getBestOffer("totalCompensation")

  return (
    <div className="space-y-6">
      {/* Checkbox for COL Adjusted Values */}
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="showAdjusted"
          checked={showAdjustedValues}
          onCheckedChange={(checked) => setShowAdjustedValues(!!checked)}
        />
        <label
          htmlFor="showAdjusted"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Cost of Living Adjusted Values
        </label>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <Card
            key={offers[index].id}
            className={`shadow-lg ${showAdjustedValues && index === bestAdjustedTakeHome ? "ring-2 ring-green-500" : ""}`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{offers[index].name}</span>
                {showAdjustedValues && index === bestAdjustedTakeHome && (
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Best Adjusted
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Annual Take-Home (green color text) */}
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 mb-1">Annual Take-Home</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(result.netTakeHome)}</p>
              </div>
              {/* Monthly Take-Home (blue color text) */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Monthly Take-Home</p>
                <p className="text-xl font-semibold text-blue-700">{formatCurrency(result.monthlyTakeHome)}</p>
              </div>

              {showAdjustedValues && (
                <>
                  {/* Adjusted Annual Take-Home (green color text) */}
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Adjusted Annual Take-Home</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(result.adjustedAnnualTakeHome)}</p>
                  </div>
                  {/* Adjusted Monthly Take-Home (blue color text) */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 mb-1">Adjusted Monthly Take-Home</p>
                    <p className="text-xl font-semibold text-blue-700">
                      {formatCurrency(result.adjustedMonthlyTakeHome)}
                    </p>
                  </div>
                </>
              )}

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Compensation:</span>
                  <span className="font-medium">{formatCurrency(result.totalCompensation)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Tax Rate:</span>
                  <span className="font-medium">{result.effectiveTaxRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">
                    {offers[index].city}, {offers[index].state}
                  </span>
                </div>
                {showAdjustedValues && (
                  <div className="flex justify-between">
                    <span>COL Index:</span>
                    <span className="font-medium">{result.costOfLivingIndex.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Detailed Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Component</th>
                  {offers.map((offer) => (
                    <th key={offer.id} className="text-right py-2 font-semibold">
                      {offer.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                <tr className="border-b bg-blue-50">
                  <td className="py-2 font-medium">Base Salary</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="text-right py-2">
                      {formatCurrency(offer.baseSalary)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Annual Stock Value</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="text-right py-2">
                      {offer.vestingPeriod > 0 ? formatCurrency(offer.stockOptions / offer.vestingPeriod) : "$0"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Signing Bonus</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="text-right py-2">
                      {formatCurrency(offer.signingBonus)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Performance Bonus</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="text-right py-2">
                      {formatCurrency(offer.performanceBonus)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Remote Stipend</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="text-right py-2">
                      {formatCurrency(offer.remoteStipend)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">401K Match</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="text-right py-2">
                      {formatCurrency((offer.baseSalary * offer.match401k) / 100)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Benefits Value</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2">
                      {formatCurrency(result.benefitsValue)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-blue-50 font-semibold">
                  <td className="py-2">Total Compensation</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2">
                      {formatCurrency(result.totalCompensation)}
                      {index === bestTotalComp && <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Federal Tax</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2 text-red-600">
                      -{formatCurrency(result.federalTax)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">State Tax</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2 text-red-600">
                      -{formatCurrency(result.stateTax)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">FICA Taxes</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2 text-red-600">
                      -{formatCurrency(result.totalFICATax)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b font-semibold">
                  <td className="py-2">Total Taxes</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2 text-red-600">
                      -{formatCurrency(result.totalTax)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-green-50 font-semibold">
                  <td className="py-2">Annual Take-Home</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2 text-green-700">
                      {formatCurrency(result.netTakeHome)}
                      {index === bestNetTakeHome && <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />}
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-green-50 font-semibold">
                  <td className="py-2">Monthly Take-Home</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2 text-green-700">
                      {formatCurrency(result.monthlyTakeHome)}
                    </td>
                  ))}
                </tr>
                {showAdjustedValues && (
                  <>
                    <tr className="border-b">
                      <td className="py-2">Cost of Living Index</td>
                      {results.map((result, index) => (
                        <td key={offers[index].id} className="text-right py-2">
                          {result.costOfLivingIndex.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b bg-purple-50 font-semibold">
                      <td className="py-2">Adjusted Annual Take-Home</td>
                      {results.map((result, index) => (
                        <td key={offers[index].id} className="text-right py-2 text-purple-700">
                          {formatCurrency(result.adjustedAnnualTakeHome)}
                          {index === bestAdjustedTakeHome && (
                            <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b bg-purple-50 font-semibold">
                      <td className="py-2">Adjusted Monthly Take-Home</td>
                      {results.map((result, index) => (
                        <td key={offers[index].id} className="text-right py-2 text-purple-700">
                          {formatCurrency(result.adjustedMonthlyTakeHome)}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
                <tr>
                  <td className="py-2">Effective Tax Rate</td>
                  {results.map((result, index) => (
                    <td key={offers[index].id} className="text-right py-2">
                      {result.effectiveTaxRate.toFixed(1)}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
