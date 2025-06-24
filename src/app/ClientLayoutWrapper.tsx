"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/NavbarComponent";
import { Footer } from "@/components/FooterComponent";
import { ReactQueryProviderClient } from "./ReactQueryProviderClient";
import { useEffect, useState } from "react";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    setShowNavbar(pathname !== "/login");
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}

      <div className="flex-grow">
        <ReactQueryProviderClient>{children}</ReactQueryProviderClient>
      </div>

      <Footer />
    </div>
  );
}
