import type React from "react"
import '../styles/globals.css'
import { Inter } from "next/font/google"
import Layout from '@/components/Layout'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}



