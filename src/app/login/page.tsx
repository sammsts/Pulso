"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { accessToken } = await login({ username, password });
      document.cookie = `accessToken=${accessToken}; path=/; max-age=3600`;
      document.cookie = `username=${username};`;
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Login inválido');
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-blue-600 font-bold text-center">Pulso</h1>
        <h3 className="text-1xl text-gray-600 font-bold mb-8 text-center">Login</h3>
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-blue-500"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-3 rounded mb-6 w-full focus:outline-blue-500"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white py-3 rounded w-full hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}
