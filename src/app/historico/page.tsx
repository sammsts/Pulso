"use client";

import { useQuery } from "@tanstack/react-query";
import { getPunchHistory } from "@/services/punchService";

export default function HistoricoPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["historico"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");
      return getPunchHistory(token);
    },
  });

  if (isLoading) return <div className="p-6 text-center">Carregando histórico...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Erro ao carregar histórico.</div>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Histórico de Pontos</h1>
      <ul className="space-y-4">
        {data.map((item: any) => (
          <li
            key={item.id}
            className="border p-4 rounded shadow-sm bg-white flex justify-between"
          >
            <span>{new Date(item.timestamp).toLocaleString()}</span>
            <span className="font-semibold">Presente</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
