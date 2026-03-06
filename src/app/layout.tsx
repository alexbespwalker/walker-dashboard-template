import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { PROJECT_NAME, PROJECT_SUBTITLE } from "@/lib/constants"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: PROJECT_NAME,
  description: `${PROJECT_SUBTITLE} Dashboard`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
