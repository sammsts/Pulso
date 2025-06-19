"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { markPunch } from "@/services/punchService";

export default function MarcarPontoPage() {
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");
      await markPunch(token);
    },
    onSuccess: () => {
      setMensagem("Ponto marcado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
    onError: () => {
      setMensagem("Erro ao marcar ponto.");
    },
  });

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Marcar Ponto</h1>

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isLoading}
        className={`w-full py-3 rounded text-white ${
          mutation.isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        } transition`}
      >
        {mutation.isLoading ? "Marcando..." : "Marcar Ponto"}
      </button>

      {mensagem && (
        <p
          className={`mt-4 text-center ${
            mutation.isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {mensagem}
        </p>
      )}
    </main>
  );
}
