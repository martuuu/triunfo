"use client"

import type React from "react"

import Link from "next/link"

export default function Login() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de login con Supabase
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/">
        <button className="mb-4 flex items-center text-gray-600 hover:text-gray-800">
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Atrás
        </button>
      </Link>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                Nickname o Email
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="Nickname o email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-400 text-white py-2 px-4 rounded-md hover:bg-sky-500 transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

