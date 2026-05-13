import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import { AgencyProvider } from '@/lib/agencyContext'
import { ThemeProvider } from '@/lib/themeContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Innovate.AI — Real Estate Marketing Platform',
  description: 'AI-powered vendor lead generation and marketing hub for real estate agents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${geistMono.variable}`}>
      <body className="h-full"><ThemeProvider><AgencyProvider>{children}</AgencyProvider></ThemeProvider></body>
    </html>
  )
}
