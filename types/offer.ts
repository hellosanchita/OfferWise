import type { SelectedBenefits } from "../data/benefits-valuation"

export interface JobOffer {
  id: string
  name: string
  baseSalary: number
  stockOptions: number
  vestingPeriod: number
  signingBonus: number
  performanceBonus: number
  remoteStipend: number
  match401k: number
  city: string // New field for city
  filingStatus: "Single" | "MarriedFilingJointly" | "HeadOfHousehold"
  state: string
  benefits: SelectedBenefits
}

export interface CalculationResult {
  grossIncome: number
  totalCompensation: number
  benefitsValue: number
  adjustedCompensation: number // Adjusted for cost of living
  costOfLivingIndex: number
  netTakeHome: number
  monthlyTakeHome: number
  adjustedMonthlyTakeHome: number // Adjusted for cost of living
  adjustedAnnualTakeHome: number // Adjusted for cost of living
  federalTax: number
  stateTax: number
  socialSecurityTax: number
  medicareTax: number
  additionalMedicareTax: number
  totalFICATax: number
  totalTax: number
  effectiveTaxRate: number
  federalTaxableIncome: number
  stateTaxableIncome: number
  federalStandardDeduction: number
  stateStandardDeduction: number
}
