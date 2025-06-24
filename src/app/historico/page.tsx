"use client";

import { useQuery } from "@tanstack/react-query";
import { getPunchHistory } from "@/services/punchService";
import { useState } from "react";
import Cookies from "js-cookie";

export default function HistoricoPage() {
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["historico"],
    queryFn: async () => {
      const token = Cookies.get("accessToken");;
      if (!token) throw new Error("Usuário não autenticado");
      return getPunchHistory(token);
    },
  });

  const historicoFiltrado = data?.filter((item: any) => {
    const dataPonto = new Date(item.timestamp);
    const inicio = filtroInicio ? new Date(filtroInicio) : null;
    const fim = filtroFim ? new Date(filtroFim) : null;

    return (!inicio || dataPonto >= inicio) && (!fim || dataPonto <= fim);
  });

  if (isLoading) return <div className="p-6 text-center">Carregando histórico...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Erro ao carregar histórico.</div>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Histórico de Pontos</h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-center">
        <div>
          <label className="block text-sm font-medium mb-1">De:</label>
          <input
            type="date"
            value={filtroInicio}
            onChange={(e) => setFiltroInicio(e.target.value)}
            className="border px-3 py-1 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Até:</label>
          <input
            type="date"
            value={filtroFim}
            onChange={(e) => setFiltroFim(e.target.value)}
            className="border px-3 py-1 rounded-md"
          />
        </div>
      </div>

      {historicoFiltrado?.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-3 text-right">
            {historicoFiltrado.length} registro(s) encontrado(s)
          </p>
          <ul className="space-y-4">
            {historicoFiltrado.map((item: any) => (
              <li
                key={item.id}
                className="border p-4 rounded-md shadow-sm bg-white flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2"
              >
                <span className="text-gray-700">
                  {new Date(item.timestamp).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
                <span className="font-semibold text-green-600">Presente</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          Nenhum registro encontrado para o período selecionado.
        </div>
      )}
    </main>
  );
}
