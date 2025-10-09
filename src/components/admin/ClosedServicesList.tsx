import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { format } from "date-fns";

interface ClosedService {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string | null;
  service_value: number | null;
  service_date: string | null;
  service_address: string | null;
  description: string;
  closed_at: string | null;
}

export const ClosedServicesList = () => {
  const [services, setServices] = useState<ClosedService[]>([]);

  useEffect(() => {
    fetchClosedServices();

    const channel = supabase
      .channel('closed_services_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, fetchClosedServices)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchClosedServices = async () => {
    const { data } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("status", "closed")
      .order("service_date", { ascending: false, nullsFirst: false })
      .order("closed_at", { ascending: false });

    setServices(data || []);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo de Serviço</TableHead>
              <TableHead>Data do Serviço</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum serviço fechado ainda
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.service_type || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                    {service.service_date 
                      ? format(new Date(service.service_date), "dd/MM/yyyy HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${Number(service.service_value || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Serviço</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-semibold">Cliente</Label>
                              <p>{service.name}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Email</Label>
                              <p>{service.email}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Telefone</Label>
                              <p>{service.phone}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Tipo de Serviço</Label>
                              <p>{service.service_type || "N/A"}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-semibold">Data do Serviço</Label>
                              <p>
                                {service.service_date 
                                  ? format(new Date(service.service_date), "dd/MM/yyyy 'às' HH:mm")
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <Label className="font-semibold">Valor</Label>
                              <p className="text-lg font-bold">
                                ${Number(service.service_value || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Label className="font-semibold">Endereço do Serviço</Label>
                            <p className="mt-1 text-sm">{service.service_address || service.phone}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Descrição Original</Label>
                            <p className="mt-1 text-sm">{service.description}</p>
                          </div>
                          {service.closed_at && (
                            <div>
                              <Label className="font-semibold">Fechado em</Label>
                              <p>{format(new Date(service.closed_at), "dd/MM/yyyy 'às' HH:mm")}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
