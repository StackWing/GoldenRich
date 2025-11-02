import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "RichLab - Վաստակեք օնլայն",
  description: "Վաստակեք դրամ առաջադրանքներ կատարելով, տեսանյութեր դիտելով և ընկերներ հրավիրելով",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hy">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
