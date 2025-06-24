"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // ícones

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "nomeUsuario=; Max-Age=0; path=/";
    router.push("/login");
  };

  const navItems = [
    { label: "Início", href: "/dashboard" },
    { label: "Marcar ponto", href: "/marcar-ponto" },
    { label: "Histórico", href: "/historico" },
    { label: "Perfil", href: "/profile" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-50 to-white border-b shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Saudações */}
        <div className="text-sm sm:text-lg font-bold text-blue-600">
          Pulso
        </div>

        {/* Menu hamburger mobile */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navegação desktop */}
        <nav className="hidden sm:flex gap-4 items-center">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Button
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 transition-all"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </nav>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 space-y-2 px-2">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`block w-full px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <Button
            variant="outline"
            className="w-full hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
          >
            Sair
          </Button>
        </div>
      )}
    </header>
  );
}
