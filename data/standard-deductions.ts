export interface StandardDeductions {
  Single: number
  MarriedFilingJointly: number
  HeadOfHousehold: number
}

export interface FederalStandardDeductions {
  2024: StandardDeductions
}

export interface StateStandardDeductions {
  [state: string]: StandardDeductions
}

// 2024 Federal Standard Deductions
export const federalStandardDeductions: FederalStandardDeductions = {
  2024: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
}

// State Standard Deductions for 2024
export const stateStandardDeductions: StateStandardDeductions = {
  Alabama: {
    Single: 2500,
    MarriedFilingJointly: 7500,
    HeadOfHousehold: 4700,
  },
  Alaska: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  Arizona: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Arkansas: {
    Single: 2340,
    MarriedFilingJointly: 4680,
    HeadOfHousehold: 3510,
  },
  California: {
    Single: 5202,
    MarriedFilingJointly: 10404,
    HeadOfHousehold: 10726,
  },
  Colorado: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Connecticut: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  Delaware: {
    Single: 3250,
    MarriedFilingJointly: 6500,
    HeadOfHousehold: 4875,
  },
  Florida: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  Georgia: {
    Single: 4600,
    MarriedFilingJointly: 6000,
    HeadOfHousehold: 4600,
  },
  Hawaii: {
    Single: 2200,
    MarriedFilingJointly: 4400,
    HeadOfHousehold: 3212,
  },
  Idaho: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Illinois: {
    Single: 2775,
    MarriedFilingJointly: 5550,
    HeadOfHousehold: 4125,
  },
  Indiana: {
    Single: 1000,
    MarriedFilingJointly: 2000,
    HeadOfHousehold: 1500,
  },
  Iowa: {
    Single: 2210,
    MarriedFilingJointly: 5450,
    HeadOfHousehold: 3260,
  },
  Kansas: {
    Single: 3500,
    MarriedFilingJointly: 8000,
    HeadOfHousehold: 5800,
  },
  Kentucky: {
    Single: 2770,
    MarriedFilingJointly: 5540,
    HeadOfHousehold: 4110,
  },
  Louisiana: {
    Single: 4500,
    MarriedFilingJointly: 9000,
    HeadOfHousehold: 6750,
  },
  Maine: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Maryland: {
    Single: 2400,
    MarriedFilingJointly: 4800,
    HeadOfHousehold: 3600,
  },
  Massachusetts: {
    Single: 4400,
    MarriedFilingJointly: 8800,
    HeadOfHousehold: 6600,
  },
  Michigan: {
    Single: 5050,
    MarriedFilingJointly: 10100,
    HeadOfHousehold: 7575,
  },
  Minnesota: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Mississippi: {
    Single: 2300,
    MarriedFilingJointly: 4600,
    HeadOfHousehold: 3400,
  },
  Missouri: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Montana: {
    Single: 5040,
    MarriedFilingJointly: 10080,
    HeadOfHousehold: 7560,
  },
  Nebraska: {
    Single: 8100,
    MarriedFilingJointly: 16200,
    HeadOfHousehold: 12150,
  },
  Nevada: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  "New Hampshire": {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  "New Jersey": {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  "New Mexico": {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  "New York": {
    Single: 8000,
    MarriedFilingJointly: 16050,
    HeadOfHousehold: 11200,
  },
  "North Carolina": {
    Single: 12750,
    MarriedFilingJointly: 25500,
    HeadOfHousehold: 19125,
  },
  "North Dakota": {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Ohio: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  Oklahoma: {
    Single: 6350,
    MarriedFilingJointly: 12700,
    HeadOfHousehold: 9350,
  },
  Oregon: {
    Single: 2745,
    MarriedFilingJointly: 5490,
    HeadOfHousehold: 4120,
  },
  Pennsylvania: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  "Rhode Island": {
    Single: 10400,
    MarriedFilingJointly: 20800,
    HeadOfHousehold: 15600,
  },
  "South Carolina": {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  "South Dakota": {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  Tennessee: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehood: 0,
  },
  Texas: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  Utah: {
    Single: 14600,
    MarriedFilingJointly: 29200,
    HeadOfHousehold: 21900,
  },
  Vermont: {
    Single: 7150,
    MarriedFilingJointly: 14300,
    HeadOfHousehold: 10725,
  },
  Virginia: {
    Single: 4500,
    MarriedFilingJointly: 9000,
    HeadOfHousehold: 6750,
  },
  Washington: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  "West Virginia": {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
  Wisconsin: {
    Single: 15060,
    MarriedFilingJointly: 27920,
    HeadOfHousehold: 22120,
  },
  Wyoming: {
    Single: 0,
    MarriedFilingJointly: 0,
    HeadOfHousehold: 0,
  },
}
