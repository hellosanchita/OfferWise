export interface SelectedBenefits {
  healthInsuranceCost: number
  dentalInsuranceCost: number
  visionInsuranceCost: number
  lifeInsuranceCost: number // User inputs yearly cost directly
  shortTermDisabilityCost: number
  longTermDisabilityCost: number
  ptoDays: number // Number of days, value derived from dailySalary
  fsaContribution: number // User inputs contribution, tax savings calculated
  commuterBenefitsMonthly: number // User inputs monthly, convert to annual
  gymMembershipCost: number
  phoneStipendCost: number
  internetStipendCost: number
  professionalDevelopmentCost: number
  tuitionReimbursementCost: number
}

// Constants for calculations that are not direct inputs
const FSA_TAX_SAVINGS_RATE = 0.22 // Average tax savings rate for FSA
const PTO_DAILY_VALUE_MULTIPLIER = 1 // Value of 1 PTO day is 1x daily salary

export function calculateBenefitsValue(benefits: SelectedBenefits, dailySalary: number): number {
  let totalValue = 0

  totalValue += benefits.healthInsuranceCost
  totalValue += benefits.dentalInsuranceCost
  totalValue += benefits.visionInsuranceCost
  totalValue += benefits.lifeInsuranceCost
  totalValue += benefits.shortTermDisabilityCost
  totalValue += benefits.longTermDisabilityCost

  // PTO value is based on daily salary
  totalValue += benefits.ptoDays * dailySalary * PTO_DAILY_VALUE_MULTIPLIER

  // FSA tax savings
  totalValue += benefits.fsaContribution * FSA_TAX_SAVINGS_RATE

  // Commuter benefits (monthly input converted to annual)
  totalValue += benefits.commuterBenefitsMonthly * 12

  totalValue += benefits.gymMembershipCost
  totalValue += benefits.phoneStipendCost
  totalValue += benefits.internetStipendCost
  totalValue += benefits.professionalDevelopmentCost
  totalValue += benefits.tuitionReimbursementCost

  return totalValue
}
