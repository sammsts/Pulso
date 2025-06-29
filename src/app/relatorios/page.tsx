"use client";

import { useMutation } from "@tanstack/react-query";
import { generateReport } from "@/services/reportService";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Cookies from "js-cookie";

export default function RelatoriosPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [type, setType] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Usuário não autenticado");

      await generateReport(token, {
        startDate,
        endDate,
        type: type === null || type === "" ? null : parseInt(type, 10),
      });
    },
    onError: (error: any) => {
      if (!error.message) {
        setValidationError("Erro desconhecido ao gerar relatório");
      }
    },
  });

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      setValidationError("As datas de início e fim são obrigatórias.");
      return;
    }

    setValidationError(null);
    mutation.mutate();
  };

  return (
    <main className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg mt-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Relatório de Pontos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Data inicial */}
        <div>
          <label className="block text-sm font-medium mb-1">Data Início</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? format(startDate, "dd/MM/yyyy")
                  : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Data final */}
        <div>
          <label className="block text-sm font-medium mb-1">Data Fim</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Tipo de ponto */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Tipo de Ponto
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={type ?? ""}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="0">Entrada</option>
            <option value="1">Saída</option>
          </select>
        </div>
      </div>

      {validationError && (
        <p className="text-red-600 text-sm mb-4 text-center">
          {validationError}
        </p>
      )}

      <div className="flex justify-center">
        <Button onClick={handleGenerateReport} disabled={mutation.isPending}>
          {mutation.isPending ? "Gerando..." : "Gerar Relatório"}
        </Button>
      </div>

      {mutation.isSuccess && (
        <p className="mt-4 text-green-600 text-center">
          Relatório gerado com sucesso!
        </p>
      )}
      {mutation.isError && !validationError && (
        <p className="mt-4 text-red-600 text-center">
          Erro ao gerar relatório: {(mutation.error as Error).message}
        </p>
      )}
    </main>
  );
}
