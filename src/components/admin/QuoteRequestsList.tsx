import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Eye } from "lucide-react";
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
  created_at: string;
  updated_at: string;
}

export const QuoteRequestsList = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [serviceValue, setServiceValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('quote_requests_list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests'
        },
        () => {
          fetchQuotes();
        }
      )
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
    if (!selectedQuote || !serviceValue) {
      toast({
        title: "Error",
        description: "Please enter a service value",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("quote_requests")
      .update({
        status: "closed",
        service_value: parseFloat(serviceValue),
        closed_at: new Date().toISOString(),
        closed_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq("id", selectedQuote.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to close quote",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Quote closed successfully",
    });

    setDialogOpen(false);
    setServiceValue("");
    setSelectedQuote(null);
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
                        <Dialog open={dialogOpen && selectedQuote?.id === quote.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) setSelectedQuote(quote);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Close
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Close Quote</DialogTitle>
                              <DialogDescription>
                                Enter the final service value for this quote
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label htmlFor="value">Service Value ($)</Label>
                                <Input
                                  id="value"
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={serviceValue}
                                  onChange={(e) => setServiceValue(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setDialogOpen(false);
                                  setServiceValue("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleCloseQuote}>
                                Close Quote
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
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