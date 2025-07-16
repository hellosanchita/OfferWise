"use client"

import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react" // Using Calculator icon as a placeholder logo

interface WelcomeOverlayProps {
  onClose: () => void
}

export default function WelcomeOverlay({ onClose }: WelcomeOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 bg-opacity-95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
        <Calculator className="h-24 w-24 text-blue-600 mb-6 animate-bounce" />
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">OfferWise</h1>
        <p className="text-xl text-gray-700 mb-8 max-w-xs">Calculate your true take-home pay</p>
        <Button
          onClick={onClose}
          size="lg"
          className="px-12 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Let&apos;s Go!
        </Button>
      </div>
    </div>
  )
}
