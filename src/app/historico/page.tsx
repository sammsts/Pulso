"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPunchHistory, updatePunch } from "@/services/punchService";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoadingMask } from "@/components/LoadingMaskComponent";
import { ErrorMask } from "@/components/ErrorMaskComponent";
import { useHasMounted } from "@/hooks/useHasMounted";
import { EditPunchModal } from "@/components/EditPunchModal";
import { FaEdit } from "react-icons/fa";
import { deletePunch } from "@/services/punchService";

export default function HistoricoPage() {
  const hasMounted = useHasMounted();

  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const [editingPunch, setEditingPunch] = useState<any | null>(null);
  const queryClient = useQueryClient();
  const token = Cookies.get("accessToken");
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["historico"],
    queryFn: async () => {
      if (!token) throw new Error("Usuário não autenticado");
      return getPunchHistory(token);
    },
    enabled: !!token,
  });

  const mutationUpdate = useMutation({
    mutationFn: (updatedPunch: any) => {
      if (!token) throw new Error("Usuário não autenticado");
      return updatePunch(token, updatedPunch);
    },
    onSuccess: () => {
      setEditingPunch(null);
      queryClient.invalidateQueries({ queryKey: ["historico"] });
      queryClient.invalidateQueries({ queryKey: ["punchesOfDay"] });
    },
    onError: () => alert("Erro ao atualizar ponto."),
  });

  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Usuário não autenticado");
      return deletePunch(token, id);
    },
    onMutate: () => setLoadingMsg("Excluindo ponto..."),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["punchesOfDay"] });
      queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
    onError: () => setErrorMsg("Erro ao excluir ponto."),
    onSettled: () => setLoadingMsg(null),
  });

  const historicoFiltrado = data?.filter((item: any) => {
    const dataPonto = new Date(item.timestamp);
    const inicio = filtroInicio ? new Date(filtroInicio) : null;
    const fim = filtroFim
      ? new Date(new Date(filtroFim).getTime() + 24 * 60 * 60 * 1000)
      : null;

    return (!inicio || dataPonto >= inicio) && (!fim || dataPonto < fim);
  });

  if (!hasMounted) {
    return null;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Histórico de Pontos
      </h1>

      {isLoading && <LoadingMask message="Carregando histórico..." />}
      {error && <ErrorMask message="Erro ao carregar histórico." />}

      {!isLoading && !error && (
        <>
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
                {historicoFiltrado.map((item: any) => {
                  const tipoTexto =
                    item.type === 0
                      ? "Entrada"
                      : item.type === 1
                        ? "Saída"
                        : "Desconhecido";

                  const tipoCor =
                    item.type === 0
                      ? "text-green-600"
                      : item.type === 1
                        ? "text-red-600"
                        : "text-gray-500";

                  return (
                    <li
                      key={item.id}
                      className="border p-4 rounded-md shadow-sm bg-white flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2"
                    >
                      <div>
                        <span className="text-gray-700 mr-2">
                          {format(
                            new Date(item.timestamp),
                            "dd/MM/yyyy HH:mm",
                            { locale: ptBR }
                          )}
                        </span>
                        <span className={`font-semibold ${tipoCor}`}>
                          {tipoTexto}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPunch(item)}
                          className="px-3 py-1 text-sm bg-yellow-400 rounded hover:bg-yellow-500 flex items-center justify-center gap-1"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Tem certeza que deseja excluir este ponto?"
                              )
                            ) {
                              mutationDelete.mutate(item.id);
                            }
                          }}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Nenhum registro encontrado para o período selecionado.
            </div>
          )}

          {editingPunch && (
            <EditPunchModal
              punch={editingPunch}
              onClose={() => setEditingPunch(null)}
              onSave={(updated) => mutationUpdate.mutate(updated)}
            />
          )}
        </>
      )}

      {loadingMsg && <LoadingMask message={loadingMsg} />}
      {errorMsg && <ErrorMask message={errorMsg} />}
    </main>
  );
}
