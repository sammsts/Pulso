"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/userService";

export default function ProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");
      return getProfile(token);
    },
  });

  if (isLoading) return <div className="p-6 text-center">Carregando perfil...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Erro ao carregar perfil.</div>;

  return (
    <main className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Perfil</h1>
      <p className="mb-2">
        <strong>Nome:</strong> {data.name}
      </p>
      <p className="mb-2">
        <strong>Username:</strong> {data.username}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
    </main>
  );
}
