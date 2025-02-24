"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { supabase, supabaseAdmin } from "../supabase/client";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Link from "next/link";
import { useRouter } from "next/router";

// Components
import BackButton from "@/components/BackButton";

export default function CreatePlayer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones
    if (!emoji) {
      setError("Por favor selecciona un emoji");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
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
        throw new Error(
          `Error al crear el perfil del jugador: ${profileError.message}`
        );
      }

      // 3. Esperar un momento antes de intentar iniciar sesión
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 4. Iniciar sesión automáticamente
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // 5. Redirigir al home
      router.push("/home");
    } catch (err) {
      console.error("Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
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
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <div className="flex justify-start items-center mb-6">
          <BackButton />
          <h2 className="text-md mx-4">Creación de jugador</h2>
        </div>
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
          <div className="grid gap-4 max-w-sm mx-auto">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-400 to-violet-500 text-white py-3 px-6 rounded-md hover:bg-violet-600 transition-colors"
              >
                {loading ? "Cargando..." : "Crear Jugador"}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
