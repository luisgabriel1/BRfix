import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, CheckCircle, TrendingUp } from "lucide-react";

interface Stats {
  totalQuotes: number;
  closedServices: number;
  conversionRate: number;
  totalValue: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalQuotes: 0,
    closedServices: 0,
    conversionRate: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('dashboard_stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    const { data: allQuotes } = await supabase
      .from("quote_requests")
      .select("*");

    if (!allQuotes) return;

    const closedServices = allQuotes.filter((q) => q.status === "closed");
    const totalValue = closedServices.reduce(
      (sum, q) => sum + (Number(q.service_value) || 0),
      0
    );
    const conversionRate = allQuotes.length > 0 
      ? (closedServices.length / allQuotes.length) * 100 
      : 0;

    setStats({
      totalQuotes: allQuotes.length,
      closedServices: closedServices.length,
      conversionRate: Math.round(conversionRate),
      totalValue,
    });
  };

  const statCards = [
    {
      title: "Total de Orçamentos",
      value: stats.totalQuotes,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Serviços Fechados",
      value: stats.closedServices,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Valor Total",
      value: `$${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};