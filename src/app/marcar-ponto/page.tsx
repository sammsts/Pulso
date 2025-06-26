"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { markPunch } from "@/services/punchService";

async function getEndereco(latitude: number, longitude: number) {
  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
  );
  const data = await res.json();
  const c = data.results[0].components;
  return `${c.country} - ${c.city || c.town || c.village} - ${c.state} - ${c.postcode} - ${c.road}`;
}

export default function MarcarPontoPage() {
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState("");
  const [dataHora, setDataHora] = useState(new Date());
  const [localizacao, setLocalizacao] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");
      await markPunch(token, { type: localizacao ?? "default" });
    },
    onSuccess: () => {
      setMensagem("Ponto marcado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
    onError: () => {
      setMensagem("Erro ao marcar ponto.");
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDataHora(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const endereco = await getEndereco(coords.latitude, coords.longitude);
        setLocalizacao(endereco);
      },
      (err) => console.error("Erro ao obter localização", err),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Marcar Ponto</h1>

      <div className="bg-gray-100 rounded p-4 mb-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Data e hora atual</p>
        <p className="text-lg font-medium">
          {dataHora.toLocaleString("pt-BR")}
        </p>
      </div>

      {localizacao && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 text-sm text-blue-800">
          Localização atual: {localizacao}
        </div>
      )}

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.status === "pending"}
        className={`w-full py-3 rounded text-white text-lg font-semibold ${
          mutation.status === "pending"
            ? "bg-gray-400"
            : "bg-green-600 hover:bg-green-700 transition"
        }`}
      >
        {mutation.status === "pending" ? "Marcando..." : "Marcar Ponto"}
      </button>

      {mensagem && (
        <p
          className={`mt-4 text-center text-sm ${
            mutation.status === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {mensagem}
        </p>
      )}
    </main>
  );
}
