export interface TaxBracket {
  min: number
  max: number | null
  rate: number
}

export interface FederalTaxBrackets {
  Single: TaxBracket[]
  MarriedFilingJointly: TaxBracket[]
  HeadOfHousehold: TaxBracket[]
}

const federalTaxBrackets: FederalTaxBrackets = {
  Single: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11601, max: 47150, rate: 0.12 },
    { min: 47151, max: 100525, rate: 0.22 },
    { min: 100526, max: 191950, rate: 0.24 },
    { min: 191951, max: 243725, rate: 0.32 },
    { min: 243726, max: 609350, rate: 0.35 },
    { min: 609351, max: null, rate: 0.37 },
  ],
  MarriedFilingJointly: [
    { min: 0, max: 23200, rate: 0.1 },
    { min: 23201, max: 94300, rate: 0.12 },
    { min: 94301, max: 201050, rate: 0.22 },
    { min: 201051, max: 383900, rate: 0.24 },
    { min: 383901, max: 487450, rate: 0.32 },
    { min: 487451, max: 731200, rate: 0.35 },
    { min: 731201, max: null, rate: 0.37 },
  ],
  HeadOfHousehold: [
    { min: 0, max: 16550, rate: 0.1 },
    { min: 16551, max: 63100, rate: 0.12 },
    { min: 63101, max: 100500, rate: 0.22 },
    { min: 100501, max: 191950, rate: 0.24 },
    { min: 191951, max: 243700, rate: 0.32 },
    { min: 243701, max: 609350, rate: 0.35 },
    { min: 609351, max: null, rate: 0.37 },
  ],
}

export default federalTaxBrackets
