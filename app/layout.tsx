import type React from "react"
import '../styles/globals.css'
import { Inter } from "next/font/google"
import { motion, AnimatePresence } from 'framer-motion'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AnimatePresence mode="wait">
          <motion.main 
            className="min-h-screen bg-background"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </body>
    </html>
  )
}



