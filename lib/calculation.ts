import type { TaxBracket, FederalTaxBrackets } from "../data/federal-tax-brackets"
import type { StateTaxBrackets } from "../data/state-tax-brackets"
import { federalStandardDeductions, stateStandardDeductions } from "../data/standard-deductions"
import { ficaTaxRates } from "../data/fica-taxes"

type FilingStatus = "Single" | "MarriedFilingJointly" | "HeadOfHousehold"

export function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let totalTax = 0
  let remainingIncome = income

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break

    const bracketMin = bracket.min
    const bracketMax = bracket.max ?? Number.POSITIVE_INFINITY
    const bracketRate = bracket.rate

    // Calculate taxable income in this bracket
    const taxableInThisBracket = Math.min(remainingIncome, bracketMax - bracketMin + 1)

    if (taxableInThisBracket > 0) {
      totalTax += taxableInThisBracket * bracketRate
      remainingIncome -= taxableInThisBracket
    }
  }

  return totalTax
}

export function calculateFederalTax(
  income: number,
  filingStatus: FilingStatus,
  federalTaxBrackets: FederalTaxBrackets,
): number {
  const standardDeduction = federalStandardDeductions[2024][filingStatus]
  const taxableIncome = Math.max(0, income - standardDeduction)
  const brackets = federalTaxBrackets[filingStatus]
  return calculateProgressiveTax(taxableIncome, brackets)
}

export function calculateStateTax(
  income: number,
  state: string,
  filingStatus: FilingStatus,
  stateTaxBrackets: StateTaxBrackets,
): number {
  const stateBrackets = stateTaxBrackets[state]
  if (!stateBrackets) return 0

  const stateStandardDeduction = stateStandardDeductions[state]?.[filingStatus] || 0
  const taxableIncome = Math.max(0, income - stateStandardDeduction)
  const brackets = stateBrackets[filingStatus]
  return calculateProgressiveTax(taxableIncome, brackets)
}

export function calculateFICATaxes(
  income: number,
  filingStatus: FilingStatus,
): {
  socialSecurityTax: number
  medicareTax: number
  additionalMedicareTax: number
  totalFICATax: number
} {
  // Social Security Tax (6.2% up to wage base)
  const socialSecurityTaxableWages = Math.min(income, ficaTaxRates.socialSecurity.wageBase)
  const socialSecurityTax = socialSecurityTaxableWages * ficaTaxRates.socialSecurity.rate

  // Medicare Tax (1.45% on all wages)
  const medicareTax = income * ficaTaxRates.medicare.rate

  // Additional Medicare Tax (0.9% on wages over threshold)
  const additionalMedicareThreshold = ficaTaxRates.medicare.additionalThreshold[filingStatus]
  const additionalMedicareTaxableWages = Math.max(0, income - additionalMedicareThreshold)
  const additionalMedicareTax = additionalMedicareTaxableWages * ficaTaxRates.medicare.additionalRate

  const totalFICATax = socialSecurityTax + medicareTax + additionalMedicareTax

  return {
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    totalFICATax,
  }
}

export interface CalculateNetTakeHomeProps {
  income: number
  filingStatus: FilingStatus
  state: string
  federalTaxBrackets: FederalTaxBrackets
  stateTaxBrackets: StateTaxBrackets
}

export function calculateNetTakeHome({
  income,
  filingStatus,
  state,
  federalTaxBrackets,
  stateTaxBrackets,
}: CalculateNetTakeHomeProps): {
  netTakeHome: number
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
} {
  const federalStandardDeduction = federalStandardDeductions[2024][filingStatus]
  const stateStandardDeduction = stateStandardDeductions[state]?.[filingStatus] || 0

  const federalTaxableIncome = Math.max(0, income - federalStandardDeduction)
  const stateTaxableIncome = Math.max(0, income - stateStandardDeduction)

  const federalTax = calculateFederalTax(income, filingStatus, federalTaxBrackets)
  const stateTax = calculateStateTax(income, state, filingStatus, stateTaxBrackets)

  const ficaTaxes = calculateFICATaxes(income, filingStatus)

  const totalTax = federalTax + stateTax + ficaTaxes.totalFICATax
  const netTakeHome = income - totalTax
  const effectiveTaxRate = (totalTax / income) * 100

  return {
    netTakeHome,
    federalTax,
    stateTax,
    socialSecurityTax: ficaTaxes.socialSecurityTax,
    medicareTax: ficaTaxes.medicareTax,
    additionalMedicareTax: ficaTaxes.additionalMedicareTax,
    totalFICATax: ficaTaxes.totalFICATax,
    totalTax,
    effectiveTaxRate,
    federalTaxableIncome,
    stateTaxableIncome,
    federalStandardDeduction,
    stateStandardDeduction,
  }
}
