"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { supabase, supabaseAdmin } from "../supabase/client";
import EmojiPicker, { EmojiClickData, Category } from "emoji-picker-react";
import Link from "next/link";

export default function CreatePlayer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!emoji) {
      setError("Por favor selecciona un emoji");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // 1. Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            emoji,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user?.id) {
        throw new Error("No se pudo crear el usuario");
      }

      // 2. Insertar en la tabla players usando supabaseAdmin
      const { error: profileError } = await supabaseAdmin
        .from("players")
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            emoji,
          },
        ]);

      if (profileError) {
        console.error("Profile Error:", profileError);
        throw new Error(`Error al crear el perfil del jugador: ${profileError.message}`);
      }

      alert("Usuario creado! Por favor verifica tu email.");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".emoji-picker") && !target.closest("#emoji-input")) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <h2 className="text-2xl font-bold mb-6">Crear Jugador</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-3/4 space-y-2">
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nickname
                </label>
                <input
                  id="nickname"
                  type="text"
                  placeholder="Tu nickname"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="w-1/4 space-y-2 relative">
                <label
                  htmlFor="emoji"
                  className="block text-sm font-medium text-gray-700"
                >
                  Emoji
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="emoji-input"
                    type="text"
                    placeholder="📋"
                    value={emoji}
                    readOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                  />
                  {emoji && (
                    <button
                      type="button"
                      onClick={() => setEmoji("")}
                      className="absolute right-2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
                {showEmojiPicker && (
                  <div className="absolute z-100 emoji-picker right-0">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      autoFocusSearch={false}
                      width={300}
                      height={500}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-400 text-white py-2 px-4 rounded-md hover:bg-sky-500 transition-colors"
            >
              Crear Jugador
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
