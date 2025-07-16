"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calculator, Plus } from "lucide-react"
import { calculateNetTakeHome } from "../lib/calculation"
import federalTaxBrackets from "../data/federal-tax-brackets"
import stateTaxBrackets from "../data/state-tax-brackets"
import { OfferInput } from "../components/offer-input"
import { ResultsComparison } from "../components/results-comparison"
import type { JobOffer, CalculationResult } from "../types/offer"
import { getCityData } from "../data/cost-of-living"
import { calculateBenefitsValue } from "../data/benefits-valuation"
import WelcomeOverlay from "../components/welcome-overlay" // Import the new component

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

const FILING_STATUS_OPTIONS = [
  { value: "Single", label: "Single" },
  { value: "MarriedFilingJointly", label: "Married Filing Jointly" },
  { value: "HeadOfHousehold", label: "Head of Household" },
]

export default function OfferTakeHomeCalculator() {
  const [offers, setOffers] = useState<JobOffer[]>([
    {
      id: "offer-1",
      name: "Offer A",
      baseSalary: 0,
      stockOptions: 0,
      vestingPeriod: 4,
      signingBonus: 0,
      performanceBonus: 0,
      remoteStipend: 0,
      match401k: 0,
      city: "",
      filingStatus: "Single",
      state: "",
      benefits: {
        healthInsuranceCost: 0,
        dentalInsuranceCost: 0,
        visionInsuranceCost: 0,
        lifeInsuranceCost: 0,
        shortTermDisabilityCost: 0,
        longTermDisabilityCost: 0,
        ptoDays: 0,
        fsaContribution: 0,
        commuterBenefitsMonthly: 0,
        gymMembershipCost: 0,
        phoneStipendCost: 0,
        internetStipendCost: 0,
        professionalDevelopmentCost: 0,
        tuitionReimbursementCost: 0,
      },
    },
  ])
  const [results, setResults] = useState<CalculationResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true) // New state for overlay

  const addOffer = () => {
    if (offers.length < 3) {
      const newOffer: JobOffer = {
        id: `offer-${offers.length + 1}`,
        name: `Offer ${String.fromCharCode(65 + offers.length)}`,
        baseSalary: 0,
        stockOptions: 0,
        vestingPeriod: 4,
        signingBonus: 0,
        performanceBonus: 0,
        remoteStipend: 0,
        match401k: 0,
        city: offers[0].city,
        filingStatus: offers[0].filingStatus,
        state: offers[0].state,
        benefits: { ...offers[0].benefits },
      }
      setOffers([...offers, newOffer])
    }
  }

  const removeOffer = (id: string) => {
    setOffers(offers.filter((offer) => offer.id !== id))
    setResults([])
  }

  const updateOffer = (updatedOffer: JobOffer) => {
    setOffers(offers.map((offer) => (offer.id === updatedOffer.id ? updatedOffer : offer)))
    setResults([]) // Clear results when offers change
  }

  const calculateTotalCompensation = (offer: JobOffer) => {
    const annualStockValue = offer.vestingPeriod > 0 ? offer.stockOptions / offer.vestingPeriod : 0
    const annual401kMatch = (offer.baseSalary * offer.match401k) / 100
    const dailySalary = offer.baseSalary / 260 // 260 working days
    const benefitsValue = calculateBenefitsValue(offer.benefits, dailySalary)

    return (
      offer.baseSalary +
      annualStockValue +
      offer.signingBonus +
      offer.performanceBonus +
      offer.remoteStipend +
      annual401kMatch +
      benefitsValue
    )
  }

  const handleCalculateAll = async () => {
    const validOffers = offers.filter(
      (offer) => offer.baseSalary > 0 && offer.filingStatus && offer.state && offer.city,
    )

    if (validOffers.length === 0) return

    setIsCalculating(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const calculationResults: CalculationResult[] = []

    for (const offer of validOffers) {
      const totalCompensation = calculateTotalCompensation(offer)
      const dailySalary = offer.baseSalary / 260
      const benefitsValue = calculateBenefitsValue(offer.benefits, dailySalary)
      const cityDataForOffer = getCityData(offer.city, offer.state)
      const costOfLivingIndex = cityDataForOffer?.costOfLivingIndex || 100

      const calculationResult = calculateNetTakeHome({
        income: totalCompensation,
        filingStatus: offer.filingStatus,
        state: offer.state,
        federalTaxBrackets,
        stateTaxBrackets,
      })

      // Adjust for cost of living (higher index means more expensive)
      const adjustedCompensation = (totalCompensation / costOfLivingIndex) * 100
      const adjustedAnnualTakeHome = (calculationResult.netTakeHome / costOfLivingIndex) * 100
      const adjustedMonthlyTakeHome = adjustedAnnualTakeHome / 12

      calculationResults.push({
        grossIncome: totalCompensation,
        totalCompensation,
        benefitsValue,
        monthlyTakeHome: calculationResult.netTakeHome / 12,
        adjustedCompensation,
        adjustedAnnualTakeHome,
        adjustedMonthlyTakeHome,
        costOfLivingIndex,
        ...calculationResult,
      })
    }

    setResults(calculationResults)
    setIsCalculating(false)
  }

  const isFormValid = offers.some((offer) => offer.baseSalary > 0 && offer.filingStatus && offer.state && offer.city)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {showWelcomeOverlay && <WelcomeOverlay onClose={() => setShowWelcomeOverlay(false)} />}

      {!showWelcomeOverlay && ( // Only render main content if overlay is hidden
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">OfferWise</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Compare total compensation and take-home pay across one or more job offers and major cities within USA.
            </p>
          </div>

          {/* Offer Input Cards */}
          <div className="space-y-6 mb-8">
            {offers.map((offer, index) => (
              <OfferInput
                key={offer.id}
                offer={offer}
                onUpdate={updateOffer}
                onRemove={() => removeOffer(offer.id)}
                showRemove={offers.length > 1}
              />
            ))}
          </div>

          {/* Add Offer Button */}
          {offers.length < 3 && (
            <div className="flex justify-center mb-8">
              <Button onClick={addOffer} variant="outline" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Offer ({offers.length}/3)
              </Button>
            </div>
          )}

          {/* Calculate Button */}
          <div className="flex justify-center mb-8">
            <Button onClick={handleCalculateAll} disabled={!isFormValid || isCalculating} size="lg" className="px-8">
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Compare Offers
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                results.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <ResultsComparison
                offers={offers.filter(
                  (offer) => offer.baseSalary > 0 && offer.filingStatus && offer.state && offer.city,
                )}
                results={results}
              />
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 p-4 text-center text-gray-500 text-sm bg-gray-100 rounded-lg">
            <p>
              Disclaimer: This calculator provides estimates for informational purposes only. Tax laws, benefit
              valuations, and cost of living indices are complex and subject to change. Consult with a qualified
              financial advisor or tax professional for personalized advice.
              For any inquiries or feedback, please contact us at offerwise.fyi@gmail.com.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
