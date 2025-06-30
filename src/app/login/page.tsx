"use client";

import { useState } from "react";
import { login } from '@/services/authService';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { accessToken, user } = await login({ username, password });

      document.cookie = `accessToken=${accessToken}; path=/; max-age=3600`;
      document.cookie = `fullname=${user.fullname};`;

      window.location.href = '/dashboard';
    } catch (err) {
      setError('Usuário ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-blue-600 font-bold text-center">Pulso</h1>
        <h3 className="text-1xl text-gray-600 font-bold mb-8 text-center">Login</h3>

        <input
          type="text"
          placeholder="Usuário"
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
          disabled={isLoading}
          className={`py-3 rounded w-full transition ${
            isLoading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

        {error && (
          <p className="text-red-600 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </main>
  );
}
