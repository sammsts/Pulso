"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/NavbarComponent";
import { ReactQueryProviderClient } from "./ReactQueryProviderClient";
import { useEffect, useState } from "react";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    setShowNavbar(pathname !== "/login");
  }, [pathname]);

  return (
    <>
      {showNavbar && <Navbar />}
      <ReactQueryProviderClient>{children}</ReactQueryProviderClient>
    </>
  );
}
