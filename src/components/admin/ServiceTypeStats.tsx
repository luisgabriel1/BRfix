import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceTypeStat {
  type: string;
  totalQuotes: number;
  closedServices: number;
  conversionRate: number;
}

export const ServiceTypeStats = () => {
  const [stats, setStats] = useState<ServiceTypeStat[]>([]);

  useEffect(() => {
    fetchServiceTypeStats();

    const channel = supabase
      .channel('service_type_stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, fetchServiceTypeStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchServiceTypeStats = async () => {
    const { data: allQuotes } = await supabase
      .from("quote_requests")
      .select("*");

    if (!allQuotes) return;

    const typeMap = new Map<string, { total: number; closed: number }>();

    allQuotes.forEach(quote => {
      const type = quote.service_type || "Não especificado";
      const current = typeMap.get(type) || { total: 0, closed: 0 };
      current.total += 1;
      if (quote.status === "closed") {
        current.closed += 1;
      }
      typeMap.set(type, current);
    });

    const statsArray: ServiceTypeStat[] = Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      totalQuotes: data.total,
      closedServices: data.closed,
      conversionRate: data.total > 0 ? Math.round((data.closed / data.total) * 100) : 0,
    }));

    statsArray.sort((a, b) => b.totalQuotes - a.totalQuotes);
    setStats(statsArray);
  };

  if (stats.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas por Tipo de Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.type} className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{stat.type}</h4>
                  <Badge variant="outline">{stat.conversionRate}% conversão</Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{stat.totalQuotes} orçamentos</span>
                  <span>•</span>
                  <span>{stat.closedServices} fechados</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{stat.closedServices}</div>
                <div className="text-xs text-muted-foreground">serviços</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
