import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  observations: string;
}

export const useEmailService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendEmail = async (formData: ContactFormData) => {
    setIsLoading(true);
    
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { error } = await supabase
        .from("quote_requests")
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          description: formData.description,
          observations: formData.observations,
        }]);

      if (error) throw error;

      toast({
        title: "Quote Request Submitted!",
        description: "We'll contact you within 24 hours to discuss your project.",
        duration: 5000,
      });
      return true;
    } catch (error) {
      console.error("Quote submission error:", error);
      toast({
        title: "Error",
        description: "Unable to send request. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    isLoading,
  };
};