export interface FICATaxRates {
  socialSecurity: {
    rate: number
    wageBase: number // Maximum taxable wages
  }
  medicare: {
    rate: number
    additionalRate: number // Additional Medicare tax for high earners
    additionalThreshold: {
      Single: number
      MarriedFilingJointly: number
      HeadOfHousehold: number
    }
  }
}

// 2024 FICA Tax Rates and Limits
export const ficaTaxRates: FICATaxRates = {
  socialSecurity: {
    rate: 0.062, // 6.2%
    wageBase: 168600, // 2024 Social Security wage base
  },
  medicare: {
    rate: 0.0145, // 1.45%
    additionalRate: 0.009, // 0.9% additional Medicare tax
    additionalThreshold: {
      Single: 200000,
      MarriedFilingJointly: 250000,
      HeadOfHousehold: 200000,
    },
  },
}
