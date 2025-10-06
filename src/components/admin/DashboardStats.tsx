import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, CheckCircle, Clock } from "lucide-react";

interface Stats {
  newClients: number;
  totalClients: number;
  closedDeals: number;
  totalValue: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    newClients: 0,
    totalClients: 0,
    closedDeals: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('quote_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    // Get all quotes
    const { data: allQuotes } = await supabase
      .from("quote_requests")
      .select("*");

    if (!allQuotes) return;

    // Get quotes from last 7 days for "new clients"
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newClients = allQuotes.filter(
      (q) => new Date(q.created_at) >= sevenDaysAgo
    ).length;

    const closedQuotes = allQuotes.filter((q) => q.status === "closed");
    const totalValue = closedQuotes.reduce(
      (sum, q) => sum + (Number(q.service_value) || 0),
      0
    );

    setStats({
      newClients,
      totalClients: allQuotes.length,
      closedDeals: closedQuotes.length,
      totalValue,
    });
  };

  const statCards = [
    {
      title: "New Clients (7 days)",
      value: stats.newClients,
      icon: Clock,
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