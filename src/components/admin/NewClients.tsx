import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

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
}

export const NewClients = () => {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [serviceValues, setServiceValues] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();

    const channel = supabase
      .channel("quote_requests_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quote_requests",
        },
        () => {
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadRequests = async () => {
    const { data } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setRequests(data);
    }
  };

  const handleCloseService = async (requestId: string) => {
    const value = serviceValues[requestId];

    if (!value || isNaN(Number(value))) {
      toast({
        title: "Error",
        description: "Please enter a valid service value",
        variant: "destructive",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase
      .from("quote_requests")
      .update({
        status: "closed",
        service_value: Number(value),
        closed_at: new Date().toISOString(),
        closed_by: session?.user.id,
      })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to close service",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Service closed successfully",
      });
      setServiceValues({ ...serviceValues, [requestId]: "" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No clients yet</p>
          </CardContent>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{request.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(request.created_at)}
                  </p>
                </div>
                <Badge variant={request.status === "closed" ? "default" : "secondary"}>
                  {request.status === "closed" ? "Closed" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div>
                  <span className="font-semibold">Email: </span>
                  {request.email}
                </div>
                <div>
                  <span className="font-semibold">Phone: </span>
                  {request.phone}
                </div>
                <div>
                  <span className="font-semibold">Zip Code: </span>
                  {request.address}
                </div>
                <div>
                  <span className="font-semibold">Description: </span>
                  <p className="mt-1">{request.description}</p>
                </div>
                {request.observations && (
                  <div>
                    <span className="font-semibold">Observations: </span>
                    <p className="mt-1">{request.observations}</p>
                  </div>
                )}
              </div>

              {request.status === "pending" && (
                <div className="flex gap-2 items-end pt-4 border-t">
                  <div className="flex-1">
                    <Label htmlFor={`value-${request.id}`}>Service Value (R$)</Label>
                    <Input
                      id={`value-${request.id}`}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={serviceValues[request.id] || ""}
                      onChange={(e) =>
                        setServiceValues({
                          ...serviceValues,
                          [request.id]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button onClick={() => handleCloseService(request.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Close Service
                  </Button>
                </div>
              )}

              {request.status === "closed" && request.service_value && (
                <div className="pt-4 border-t">
                  <span className="font-semibold">Service Value: </span>
                  <span className="text-lg text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(request.service_value))}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
