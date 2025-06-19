"use client";

import { useQuery } from "@tanstack/react-query";
import { logout } from '@/utils/auth';

async function fetchPontoStatus() {
  return {
    marcadoHoje: false,
    ultimoRegistro: null,
  };
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pontoStatus"],
    queryFn: fetchPontoStatus,
  });

  if (isLoading) return <div className="p-6 text-center">Carregando...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Erro ao carregar status</div>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4 text-lg">
        {data.marcadoHoje
          ? "Você já marcou ponto hoje."
          : "Você ainda não marcou ponto hoje."}
      </p>
      {data.ultimoRegistro && (
        <p className="text-gray-600">
          Último registro: {new Date(data.ultimoRegistro).toLocaleString()}
        </p>
      )}
    </main>
  );
}
