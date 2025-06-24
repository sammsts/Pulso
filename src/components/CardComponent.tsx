// components/CardComponent.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  CalendarDays,
  BarChart,
  User,
} from "lucide-react";

export function CardComponent() {
  const items = [
    {
      title: "Marcar Ponto",
      icon: <Clock className="w-5 h-5 mr-2 text-blue-600" />,
      href: "/marcar-ponto",
    },
    {
      title: "Histórico",
      icon: <CalendarDays className="w-5 h-5 mr-2 text-green-600" />,
      href: "/historico",
    },
    {
      title: "Relatórios",
      icon: <BarChart className="w-5 h-5 mr-2 text-orange-600" />,
      href: "/relatorios",
    },
    {
      title: "Perfil",
      icon: <User className="w-5 h-5 mr-2 text-purple-600" />,
      href: "/profile",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {items.map((item, index) => (
        <Link key={index} href={item.href} className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              {item.icon}
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {item.title}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
