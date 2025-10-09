import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  observations: string | null;
  status: string;
  service_value: number | null;
  service_type: string | null;
  service_date: string | null;
  service_address: string | null;
  created_at: string;
}

export const QuoteRequestsList = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceValue: "",
    serviceType: "",
    serviceDate: "",
    serviceAddress: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();

    const channel = supabase
      .channel('quotes_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, fetchQuotes)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load quote requests",
        variant: "destructive",
      });
      return;
    }

    setQuotes(data || []);
  };

  const handleCloseQuote = async () => {
    if (!selectedQuote || !formData.serviceValue || !formData.serviceType || !formData.serviceDate) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("quote_requests")
      .update({
        status: "closed",
        service_value: parseFloat(formData.serviceValue),
        service_type: formData.serviceType,
        service_date: formData.serviceDate,
        service_address: formData.serviceAddress || selectedQuote.address,
        closed_at: new Date().toISOString(),
        closed_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq("id", selectedQuote.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Falha ao fechar orçamento",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Serviço fechado com sucesso",
    });

    setCloseDialogOpen(false);
    setFormData({ serviceValue: "", serviceType: "", serviceDate: "", serviceAddress: "" });
    setSelectedQuote(null);
  };

  const handleDeleteQuote = async (id: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir solicitação",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Solicitação excluída",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No quote requests yet
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.name}</TableCell>
                  <TableCell>{quote.email}</TableCell>
                  <TableCell>{quote.phone}</TableCell>
                  <TableCell>
                    {format(new Date(quote.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={quote.status === "closed" ? "default" : "secondary"}
                    >
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {quote.service_value
                      ? `$${Number(quote.service_value).toLocaleString()}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Quote Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Name</Label>
                                <p>{quote.name}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Email</Label>
                                <p>{quote.email}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Phone</Label>
                                <p>{quote.phone}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Zip Code</Label>
                                <p>{quote.address}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="font-semibold">Description</Label>
                              <p className="mt-1 text-sm">{quote.description}</p>
                            </div>
                            {quote.observations && (
                              <div>
                                <Label className="font-semibold">Observations</Label>
                                <p className="mt-1 text-sm">{quote.observations}</p>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Status</Label>
                                <p>
                                  <Badge
                                    variant={
                                      quote.status === "closed" ? "default" : "secondary"
                                    }
                                  >
                                    {quote.status}
                                  </Badge>
                                </p>
                              </div>
                              {quote.service_value && (
                                <div>
                                  <Label className="font-semibold">Service Value</Label>
                                  <p>${Number(quote.service_value).toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {quote.status === "pending" && (
                        <Dialog open={closeDialogOpen && selectedQuote?.id === quote.id} onOpenChange={(open) => {
                          setCloseDialogOpen(open);
                          if (open) {
                            setSelectedQuote(quote);
                            setFormData({
                              serviceValue: "",
                              serviceType: "",
                              serviceDate: "",
                              serviceAddress: quote.address,
                            });
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Fechar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Fechar Serviço</DialogTitle>
                              <DialogDescription>
                                Preencha os detalhes do serviço fechado
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="client">Cliente</Label>
                                  <Input id="client" value={quote.name} disabled />
                                </div>
                                <div>
                                  <Label htmlFor="value">Valor do Serviço ($) *</Label>
                                  <Input
                                    id="value"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.serviceValue}
                                    onChange={(e) => setFormData({...formData, serviceValue: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="type">Tipo de Serviço *</Label>
                                  <Input
                                    id="type"
                                    placeholder="Ex: Instalação elétrica"
                                    value={formData.serviceType}
                                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="date">Data do Serviço *</Label>
                                  <Input
                                    id="date"
                                    type="datetime-local"
                                    value={formData.serviceDate}
                                    onChange={(e) => setFormData({...formData, serviceDate: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="address">Endereço do Serviço</Label>
                                <Textarea
                                  id="address"
                                  placeholder="Endereço completo"
                                  value={formData.serviceAddress}
                                  onChange={(e) => setFormData({...formData, serviceAddress: e.target.value})}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCloseDialogOpen(false);
                                  setFormData({ serviceValue: "", serviceType: "", serviceDate: "", serviceAddress: "" });
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button onClick={handleCloseQuote}>
                                Fechar Serviço
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir esta solicitação?")) {
                            handleDeleteQuote(quote.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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