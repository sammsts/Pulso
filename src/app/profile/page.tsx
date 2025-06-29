"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/userService";
import Cookies from "js-cookie";
import { LoadingMask } from "@/components/LoadingMaskComponent";
import { ErrorMask } from "@/components/ErrorMaskComponent";

export default function ProfilePage() {
  const token = Cookies.get("accessToken");

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      if (!token) throw new Error("Usuário não autenticado");
      return getProfile(token);
    },
    retry: false,
  });

  if (isLoading) return <LoadingMask message="Buscando dados do perfil..." />;
  if (error)
    return (
      <ErrorMask
        message={
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados do perfil."
        }
      />
    );
  if (!data) return null;

  return (
    <main className="mt-8 p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Perfil</h1>
      <p className="mb-2">
        <strong>Nome:</strong> {data.fullName}
      </p>
      <p className="mb-2">
        <strong>Nome do usuário:</strong> {data.username}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
    </main>
  );
}
