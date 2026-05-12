import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Innovate.AI — Real Estate Marketing Platform',
  description: 'AI-powered vendor lead generation and marketing hub for real estate agents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
