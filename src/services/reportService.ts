import { api } from "@/lib/axios";

export async function generateReport(
  token: string,
  filters: { startDate: Date | undefined; endDate: Date | undefined; type: number | null }
) {
  const response = await api.post(
    "/report",
    {
      startDate: filters.startDate?.toISOString() ?? null,
      endDate: filters.endDate?.toISOString() ?? null,
      type: filters.type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });

  const url = URL.createObjectURL(blob);

  const wantToDownload = window.confirm("Deseja fazer download do relatório? Clique 'Cancelar' para visualizar no navegador.");

  if (wantToDownload) {
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorioDePontos.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(url, "_blank");
  }

  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
