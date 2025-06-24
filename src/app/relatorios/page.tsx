"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { generateReport } from "@/services/reportService";

export default function RelatoriosPage() {
  const mutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");
      await generateReport(token);
    }
  });

  return (
    <main className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Relatórios</h1>
    </main>
  );
}
