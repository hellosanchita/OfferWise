import type React from "react"

import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "OfferWise App",
  description: "Calculate your true take-home pay",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
