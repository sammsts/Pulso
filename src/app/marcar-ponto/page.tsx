"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  markPunch,
  getPunchesOfDay,
  updatePunch,
} from "@/services/punchService";
import Cookies from "js-cookie";
import { LoadingMask } from "@/components/LoadingMaskComponent";
import { ErrorMask } from "@/components/ErrorMaskComponent";
import { EditPunchModal } from "@/components/EditPunchModal";
import { FaEdit } from "react-icons/fa";
import { PunchDto } from "@/types/dtos/punchDto";
import { deletePunch } from "@/services/punchService";

async function getEndereco(latitude: number, longitude: number) {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
    );
    const data = await res.json();
    const c = data?.results?.[0]?.components;

    if (!c) return "Endereço não encontrado";

    return `${c.country} - ${c.city || c.town || c.village} - ${c.state} - ${c.postcode} - ${c.road}`;
  } catch (err) {
    console.error("Erro ao buscar endereço:", err);
    return "Erro ao obter endereço";
  }
}

export default function MarcarPontoPage() {
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState("");
  const [dataHora, setDataHora] = useState<Date | null>(null);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [endereco, setEndereco] = useState<string | null>(null);
  const [editingPunch, setEditingPunch] = useState<any | null>(null);
  const [ready, setReady] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"auto" | "manual">("auto");

  // Campos para cadastro manual
  const [manualTimestamp, setManualTimestamp] = useState<string>(""); // ISO string format for input datetime-local
  const [manualType, setManualType] = useState<"0" | "1">("0");
  const [manualError, setManualError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? Cookies.get("accessToken") : null;

  useEffect(() => {
    setReady(true);
  }, []);

  const { data: punchesOfDay, isLoading } = useQuery({
    queryKey: ["punchesOfDay"],
    queryFn: async () => {
      if (!token) throw new Error("Usuário não autenticado");

      try {
        return await getPunchesOfDay(token);
      } catch {
        setErrorMsg("Erro ao carregar pontos.");
        return [];
      }
    },
    enabled: ready && !!token,
  });

  const mutationMark = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Usuário não autenticado");
      if (!coords || !endereco) throw new Error("Localização não disponível");

      return markPunch(token, {
        Latitude: coords.latitude,
        Longitude: coords.longitude,
        Address: endereco,
        Id: null,
        Timestamp: null,
        Type: 0,
        ManuallyEdited: false,
        UserId: null,
        CreatedAt: null,
        UpdatedAt: null,
      });
    },
    onMutate: () => setLoadingMsg("Marcando ponto..."),
    onSuccess: () => {
      setMensagem("Ponto marcado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["punchesOfDay"] });
      queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
    onError: () => setErrorMsg("Erro ao marcar ponto."),
    onSettled: () => setLoadingMsg(null),
  });

  const mutationUpdate = useMutation({
    mutationFn: (updatedPunch: any) => {
      if (!token) throw new Error("Usuário não autenticado");

      const dto: PunchDto = {
        Id: updatedPunch.id,
        UserId: updatedPunch.userId,
        Type: updatedPunch.type,
        Timestamp: new Date(updatedPunch.timestamp).toISOString(),
        CreatedAt: new Date(updatedPunch.createdAt).toISOString(),
        UpdatedAt: new Date().toISOString(),
        Latitude: updatedPunch.latitude,
        Longitude: updatedPunch.longitude,
        Address: updatedPunch.address,
        ManuallyEdited: true,
      };

      return updatePunch(token, dto);
    },
    onMutate: () => setLoadingMsg("Salvando alterações..."),
    onSuccess: () => {
      setMensagem("Ponto atualizado com sucesso!");
      setEditingPunch(null);
      queryClient.invalidateQueries({ queryKey: ["punchesOfDay"] });
      queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
    onError: () => setErrorMsg("Erro ao atualizar ponto."),
    onSettled: () => setLoadingMsg(null),
  });

  // Mutation para cadastro manual
  const mutationManual = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Usuário não autenticado");
      if (!coords || !endereco) throw new Error("Localização não disponível");
      if (!manualTimestamp) {
        throw new Error("Data e hora são obrigatórias");
      }

      return markPunch(token, {
        Id: null,
        UserId: null,
        Type: Number(manualType) as PunchDto["Type"],
        Timestamp: new Date(manualTimestamp).toISOString(),
        CreatedAt: new Date(manualTimestamp).toISOString(),
        UpdatedAt: null,
        Latitude: coords.latitude,
        Longitude: coords.longitude,
        Address: endereco,
        ManuallyEdited: true,
      });
    },
    onMutate: () => {
      setLoadingMsg("Cadastrando ponto manualmente...");
      setManualError(null);
    },
    onSuccess: () => {
      setMensagem("Ponto cadastrado manualmente com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["punchesOfDay"] });
      queryClient.invalidateQueries({ queryKey: ["historico"] });
      // reset form
      setManualTimestamp("");
      setManualType("0");
      setActiveTab("auto"); // volta para aba automática
    },
    onError: (error: any) => {
      setManualError(error?.message || "Erro ao cadastrar ponto manualmente.");
    },
    onSettled: () => setLoadingMsg(null),
  });

  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Usuário não autenticado");
      return deletePunch(token, id);
    },
    onMutate: () => setLoadingMsg("Excluindo ponto..."),
    onSuccess: () => {
      setMensagem("Ponto excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["punchesOfDay"] });
      queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
    onError: () => setErrorMsg("Erro ao excluir ponto."),
    onSettled: () => setLoadingMsg(null),
  });

  useEffect(() => {
    const atualizar = () => setDataHora(new Date());
    atualizar();
    const interval = setInterval(atualizar, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ready) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const enderecoCompleto = await getEndereco(
          coords.latitude,
          coords.longitude
        );
        setCoords({ latitude: coords.latitude, longitude: coords.longitude });
        setEndereco(enderecoCompleto);
      },
      (err) => {
        console.error("Erro ao obter localização", err);
        setMensagem("Não foi possível obter sua localização.");
      },
      { enableHighAccuracy: true }
    );
  }, [ready]);

  useEffect(() => {
    if (!mensagem) return;
    const timeout = setTimeout(() => setMensagem(""), 5000);
    return () => clearTimeout(timeout);
  }, [mensagem]);

  if (!ready) return <LoadingMask message="Carregando..." />;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Marcar Ponto</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveTab("auto")}
          className={`py-2 px-6 rounded ${
            activeTab === "auto"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Marcar ponto
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`py-2 px-6 rounded ${
            activeTab === "manual"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Cadastrar ponto manual
        </button>
      </div>

      {/* Conteúdo da aba automática */}
      {activeTab === "auto" && (
        <>
          <div className="bg-gray-100 rounded p-4 mb-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Data e hora atual
            </p>
            <p className="text-lg font-medium">
              {dataHora ? dataHora.toLocaleString("pt-BR") : "Carregando..."}
            </p>
          </div>

          {endereco && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 text-sm text-blue-800">
              Localização atual: {endereco}
            </div>
          )}

          <div className="w-full">
            <button
              onClick={() => mutationMark.mutate()}
              disabled={!coords || !endereco || mutationMark.isPending}
              className={`w-full py-3 rounded text-white text-lg font-semibold transition ${
                !coords || !endereco || mutationMark.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {mutationMark.isPending ? "Marcando..." : "Marcar Ponto"}
            </button>

            {(!coords || !endereco || mutationMark.isPending) && (
              <p className="mt-1 text-center text-sm text-gray-600">
                Obtendo localização, aguarde...
              </p>
            )}
          </div>
        </>
      )}

      {/* Conteúdo da aba manual */}
      {activeTab === "manual" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutationManual.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium" htmlFor="manualTimestamp">
              Data e Hora
            </label>
            <input
              id="manualTimestamp"
              type="datetime-local"
              value={manualTimestamp}
              onChange={(e) => setManualTimestamp(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="manualType">
              Tipo
            </label>
            <select
              id="manualType"
              value={manualType}
              onChange={(e) => setManualType(e.target.value as "0" | "1")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="0">Entrada</option>
              <option value="1">Saída</option>
            </select>
          </div>

          {manualError && <p className="text-red-600 text-sm">{manualError}</p>}

          <button
            type="submit"
            disabled={mutationManual.isPending}
            className={`w-full py-3 rounded text-white text-lg font-semibold transition ${
              mutationManual.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {mutationManual.isPending ? "Cadastrando..." : "Cadastrar Ponto"}
          </button>
        </form>
      )}

      {mensagem && (
        <p
          className={`mt-4 text-center text-sm ${
            mutationMark.isError || mutationManual.isError
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {mensagem}
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Pontos do Dia</h2>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : !punchesOfDay?.length ? (
          <p>Nenhum ponto registrado hoje.</p>
        ) : (
          <ul className="space-y-3">
            {punchesOfDay.map((punch: any) => (
              <li
                key={punch.id}
                className="border p-3 rounded bg-white flex justify-between items-center"
              >
                <div>
                  <div>
                    {new Date(punch.timestamp).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                  <div
                    className={`font-semibold ${
                      punch.type === 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {punch.type === 0 ? "Entrada" : "Saída"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPunch(punch)}
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
                        mutationDelete.mutate(punch.id);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingPunch && (
        <EditPunchModal
          punch={editingPunch}
          onClose={() => setEditingPunch(null)}
          onSave={(updated) => mutationUpdate.mutate(updated)}
        />
      )}

      {loadingMsg && <LoadingMask message={loadingMsg} />}
      {errorMsg && <ErrorMask message={errorMsg} />}
    </main>
  );
}
