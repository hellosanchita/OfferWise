"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Trash2, Percent } from "lucide-react"
import type { JobOffer } from "../types/offer"
import { getCitiesByState } from "../data/cost-of-living"
import { calculateBenefitsValue, type SelectedBenefits } from "../data/benefits-valuation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

interface OfferInputProps {
  offer: JobOffer
  onUpdate: (offer: JobOffer) => void
  onRemove?: () => void
  showRemove?: boolean
}

export function OfferInput({ offer, onUpdate, onRemove, showRemove = false }: OfferInputProps) {
  const updateField = (field: keyof JobOffer, value: string | number | SelectedBenefits) => {
    onUpdate({ ...offer, [field]: value })
  }

  const updateBenefitField = (field: keyof SelectedBenefits, value: number | string | boolean) => {
    onUpdate({ ...offer, benefits: { ...offer.benefits, [field]: value } })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateTotalCompensation = () => {
    const annualStockValue = offer.vestingPeriod > 0 ? offer.stockOptions / offer.vestingPeriod : 0
    const annual401kMatch = (offer.baseSalary * offer.match401k) / 100
    const dailySalary = offer.baseSalary / 260 // Assuming 260 working days
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Input
                value={offer.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Offer Name (e.g., Company A)"
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
              />
            </CardTitle>
            <CardDescription>Enter compensation details for this offer</CardDescription>
          </div>
          {showRemove && (
            <Button variant="outline" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compensation Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`base-salary-${offer.id}`}>
              Base Salary <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id={`base-salary-${offer.id}`}
                type="number"
                placeholder="120000"
                value={offer.baseSalary || ""}
                onChange={(e) => updateField("baseSalary", Number(e.target.value) || 0)}
                className="pl-10"
                required // Mark as required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`stock-options-${offer.id}`}>Stock Options (Total Value)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id={`stock-options-${offer.id}`}
                type="number"
                placeholder="50000"
                value={offer.stockOptions || ""}
                onChange={(e) => updateField("stockOptions", Number(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`vesting-period-${offer.id}`}>Vesting Period (Years)</Label>
            <Input
              id={`vesting-period-${offer.id}`}
              type="number"
              placeholder="4"
              value={offer.vestingPeriod || ""}
              onChange={(e) => updateField("vestingPeriod", Number(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`signing-bonus-${offer.id}`}>Signing Bonus</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id={`signing-bonus-${offer.id}`}
                type="number"
                placeholder="15000"
                value={offer.signingBonus || ""}
                onChange={(e) => updateField("signingBonus", Number(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`performance-bonus-${offer.id}`}>Yearly Performance Bonus</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id={`performance-bonus-${offer.id}`}
                type="number"
                placeholder="10000"
                value={offer.performanceBonus || ""}
                onChange={(e) => updateField("performanceBonus", Number(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`remote-stipend-${offer.id}`}>Remote Stipend (Annual)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id={`remote-stipend-${offer.id}`}
                type="number"
                placeholder="2000"
                value={offer.remoteStipend || ""}
                onChange={(e) => updateField("remoteStipend", Number(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`401k-match-${offer.id}`}>401K Match (% of Base)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id={`401k-match-${offer.id}`}
                type="number"
                placeholder="6"
                step="0.1"
                value={offer.match401k || ""}
                onChange={(e) => updateField("match401k", Number(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Location and Filing Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`state-${offer.id}`}>
              State <span className="text-red-500">*</span>
            </Label>
            <Select
              value={offer.state}
              onValueChange={(value) => {
                // Directly update the offer object for state and reset city
                onUpdate({ ...offer, state: value, city: "" })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`city-${offer.id}`}>
              City <span className="text-red-500">*</span>
            </Label>
            <Select value={offer.city} onValueChange={(value) => updateField("city", value)} disabled={!offer.state}>
              <SelectTrigger>
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {offer.state &&
                  getCitiesByState(offer.state).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`filing-status-${offer.id}`}>Filing Status</Label>
            <Select value={offer.filingStatus} onValueChange={(value) => updateField("filingStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                {FILING_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Benefits Section */}
        <Tabs defaultValue="insurance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="time-off">Time Off</TabsTrigger>
            <TabsTrigger value="stipends">Stipends</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>

          <TabsContent value="insurance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`health-cost-${offer.id}`}>Health Insurance (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`health-cost-${offer.id}`}
                    type="number"
                    placeholder="8435"
                    value={offer.benefits.healthInsuranceCost || ""}
                    onChange={(e) => updateBenefitField("healthInsuranceCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dental-cost-${offer.id}`}>Dental Insurance (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`dental-cost-${offer.id}`}
                    type="number"
                    placeholder="486"
                    value={offer.benefits.dentalInsuranceCost || ""}
                    onChange={(e) => updateBenefitField("dentalInsuranceCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`vision-cost-${offer.id}`}>Vision Insurance (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`vision-cost-${offer.id}`}
                    type="number"
                    placeholder="156"
                    value={offer.benefits.visionInsuranceCost || ""}
                    onChange={(e) => updateBenefitField("visionInsuranceCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`life-cost-${offer.id}`}>Life Insurance (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`life-cost-${offer.id}`}
                    type="number"
                    placeholder="60"
                    value={offer.benefits.lifeInsuranceCost || ""}
                    onChange={(e) => updateBenefitField("lifeInsuranceCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`std-cost-${offer.id}`}>Short-term Disability (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`std-cost-${offer.id}`}
                    type="number"
                    placeholder="468"
                    value={offer.benefits.shortTermDisabilityCost || ""}
                    onChange={(e) => updateBenefitField("shortTermDisabilityCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`ltd-cost-${offer.id}`}>Long-term Disability (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`ltd-cost-${offer.id}`}
                    type="number"
                    placeholder="936"
                    value={offer.benefits.longTermDisabilityCost || ""}
                    onChange={(e) => updateBenefitField("longTermDisabilityCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time-off" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`pto-days-${offer.id}`}>PTO Days (Number of Days)</Label>
                <Input
                  id={`pto-days-${offer.id}`}
                  type="number"
                  placeholder="20"
                  value={offer.benefits.ptoDays || ""}
                  onChange={(e) => updateBenefitField("ptoDays", Number(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`fsa-contribution-${offer.id}`}>FSA Contribution (Yearly)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`fsa-contribution-${offer.id}`}
                    type="number"
                    placeholder="2000"
                    value={offer.benefits.fsaContribution || ""}
                    onChange={(e) => updateBenefitField("fsaContribution", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stipends" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`commuter-monthly-${offer.id}`}>Commuter Benefits (Monthly)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`commuter-monthly-${offer.id}`}
                    type="number"
                    placeholder="150"
                    value={offer.benefits.commuterBenefitsMonthly || ""}
                    onChange={(e) => updateBenefitField("commuterBenefitsMonthly", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`gym-cost-${offer.id}`}>Gym Membership (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`gym-cost-${offer.id}`}
                    type="number"
                    placeholder="600"
                    value={offer.benefits.gymMembershipCost || ""}
                    onChange={(e) => updateBenefitField("gymMembershipCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`phone-cost-${offer.id}`}>Phone Stipend (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`phone-cost-${offer.id}`}
                    type="number"
                    placeholder="720"
                    value={offer.benefits.phoneStipendCost || ""}
                    onChange={(e) => updateBenefitField("phoneStipendCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`internet-cost-${offer.id}`}>Internet Stipend (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`internet-cost-${offer.id}`}
                    type="number"
                    placeholder="600"
                    value={offer.benefits.internetStipendCost || ""}
                    onChange={(e) => updateBenefitField("internetStipendCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="development" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`prof-dev-cost-${offer.id}`}>Professional Development (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`prof-dev-cost-${offer.id}`}
                    type="number"
                    placeholder="2000"
                    value={offer.benefits.professionalDevelopmentCost || ""}
                    onChange={(e) => updateBenefitField("professionalDevelopmentCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`tuition-cost-${offer.id}`}>Tuition Reimbursement (Yearly Cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`tuition-cost-${offer.id}`}
                    type="number"
                    placeholder="5250"
                    value={offer.benefits.tuitionReimbursementCost || ""}
                    onChange={(e) => updateBenefitField("tuitionReimbursementCost", Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Total Compensation Summary */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Total Compensation Breakdown</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Base Salary:</span>
              <span>{formatCurrency(offer.baseSalary)}</span>
            </div>
            {offer.stockOptions > 0 && offer.vestingPeriod > 0 && (
              <div className="flex justify-between">
                <span>Annual Stock Value:</span>
                <span>{formatCurrency(offer.stockOptions / offer.vestingPeriod)}</span>
              </div>
            )}
            {offer.signingBonus > 0 && (
              <div className="flex justify-between">
                <span>Signing Bonus:</span>
                <span>{formatCurrency(offer.signingBonus)}</span>
              </div>
            )}
            {offer.performanceBonus > 0 && (
              <div className="flex justify-between">
                <span>Performance Bonus:</span>
                <span>{formatCurrency(offer.performanceBonus)}</span>
              </div>
            )}
            {offer.remoteStipend > 0 && (
              <div className="flex justify-between">
                <span>Remote Stipend:</span>
                <span>{formatCurrency(offer.remoteStipend)}</span>
              </div>
            )}
            {offer.match401k > 0 && (
              <div className="flex justify-between">
                <span>401K Match:</span>
                <span>{formatCurrency((offer.baseSalary * offer.match401k) / 100)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Benefits Value:</span>
              <span>{formatCurrency(calculateBenefitsValue(offer.benefits, offer.baseSalary / 260))}</span>
            </div>
            <div className="border-t pt-1 flex justify-between font-semibold text-blue-700">
              <span>Total Annual Compensation:</span>
              <span>{formatCurrency(calculateTotalCompensation())}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
