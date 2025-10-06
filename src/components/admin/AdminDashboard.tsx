import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, CheckCircle, DollarSign } from "lucide-react";

interface Stats {
  newClients: number;
  totalClients: number;
  closedDeals: number;
  totalValue: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    newClients: 0,
    totalClients: 0,
    closedDeals: 0,
    totalValue: 0,
  });

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel("quote_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quote_requests",
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStats = async () => {
    const { data: allRequests } = await supabase
      .from("quote_requests")
      .select("status, service_value");

    if (allRequests) {
      const newClients = allRequests.filter((r) => r.status === "pending").length;
      const closedDeals = allRequests.filter((r) => r.status === "closed").length;
      const totalValue = allRequests
        .filter((r) => r.status === "closed" && r.service_value)
        .reduce((sum, r) => sum + Number(r.service_value), 0);

      setStats({
        newClients,
        totalClients: allRequests.length,
        closedDeals,
        totalValue,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const statsCards = [
    {
      title: "New Clients",
      value: stats.newClients,
      icon: UserPlus,
      color: "text-blue-500",
    },
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Closed Deals",
      value: stats.closedDeals,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
