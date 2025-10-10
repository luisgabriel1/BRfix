import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [filteredServices, setFilteredServices] = useState<ClosedService[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");

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

  useEffect(() => {
    applyFilters();
  }, [services, filterType, filterDate, sortBy]);

  const fetchClosedServices = async () => {
    const { data } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("status", "closed");

    setServices(data || []);
  };

  const applyFilters = () => {
    let filtered = [...services];

    if (filterType !== "all") {
      filtered = filtered.filter(s => s.service_type?.toLowerCase() === filterType.toLowerCase());
    }

    if (filterDate) {
      filtered = filtered.filter(s => {
        if (!s.service_date) return false;
        const serviceDate = format(new Date(s.service_date), "yyyy-MM-dd");
        return serviceDate === filterDate;
      });
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => {
        if (!a.service_date || !b.service_date) return 0;
        return new Date(b.service_date).getTime() - new Date(a.service_date).getTime();
      });
    } else if (sortBy === "value") {
      filtered.sort((a, b) => (b.service_value || 0) - (a.service_value || 0));
    }

    setFilteredServices(filtered);
  };

  const uniqueServiceTypes = Array.from(new Set(services.map(s => s.service_type).filter(Boolean)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Filtrar por Tipo</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {uniqueServiceTypes.map(type => (
                <SelectItem key={type} value={type || ""}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Filtrar por Data</Label>
          <Input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Data recente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data mais recente</SelectItem>
              <SelectItem value="value">Maior valor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
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
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum serviço encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
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
