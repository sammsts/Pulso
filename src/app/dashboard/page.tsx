"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CardComponent } from "@/components/CardComponent";
import { Footer } from "@/components/FooterComponent";

async function fetchPontoStatus() {
  return {
    marcadoHoje: false,
    ultimoRegistro: null,
  };
}

const getEndereco = async (latitude: number, longitude: number) => {
  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
  );
  const data = await res.json();

  const components = data.results[0].components;
  const pais = components.country;
  const cidade = components.city || components.town || components.village;
  const estado = components.state;
  const cep = components.postcode;
  const logradouro = components.road;

  return `${pais} - ${cidade} - ${estado} - ${cep} - ${logradouro}`;
};

export default function DashboardPage() {
  const [fullname, setFullname] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState<string | null>(null);

  useEffect(() => {
    const nome = Cookies.get("fullname");
    setFullname(nome || null);

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
    <main className="p-6 max-w-5xl mx-auto space-y-8">
      <section>
        <h1 className="text-2xl font-semibold">
          Bem-vindo de volta,{" "}
          {fullname && (
            <b className="font-bold text-blue-600">{fullname}</b>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {localizacao
            ? `Você está atualmente em: ${localizacao}`
            : "Obtendo localização..."}
        </p>
      </section>

      <section>
        <CardComponent />
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Resumo do Sistema</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
          <li>Lance ou edite pontos manualmente quando conectado a internet.</li>
          <li>Acesse seu histórico de pontos.</li>
          <li>Gere relatórios por período.</li>
        </ul>
      </section>
    </main>
  );
}
