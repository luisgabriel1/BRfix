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
      // Para desenvolvimento e produção
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/send-email'
        : '/api/send-email'; // Ajustar conforme sua configuração de produção

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Quote Request Submitted!",
          description: "We'll contact you within 24 hours to discuss your project.",
          duration: 5000,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Email send error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to send message. Please check your connection and try again.",
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