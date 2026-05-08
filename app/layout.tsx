// Root layout — font, metadata, and global styles
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'DocFolio',
    template: '%s | DocFolio',
  },
  description: 'Beautiful portfolio websites for Indian doctors',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://docfolio.in'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  )
}
