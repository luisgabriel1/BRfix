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
      // Solução temporária: Simular envio de email bem-sucedido
      // Os dados serão registrados no console para você ver
      console.log('='.repeat(60));
      console.log('📧 NEW QUOTE REQUEST RECEIVED - BRFIX');
      console.log('='.repeat(60));
      console.log('👤 CLIENT INFORMATION:');
      console.log('   Full Name:', formData.name);
      console.log('   Email:', formData.email);
      console.log('   Phone:', formData.phone);
      console.log('   Zip Code:', formData.address);
      console.log('🏗️ PROJECT DETAILS:');
      console.log('  ', formData.description);
      console.log('📝 ADDITIONAL NOTES:');
      console.log('  ', formData.observations || 'None provided');
      console.log('='.repeat(60));
      console.log('⏰ Timestamp:', new Date().toLocaleString());
      console.log('='.repeat(60));

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Quote Request Submitted!",
        description: "We'll contact you within 24 hours to discuss your project.",
        duration: 5000,
      });
      return true;

    } catch (error) {
      console.error("Email send error:", error);
      toast({
        title: "Connection Error", 
        description: "Unable to send message. Please contact us directly at +1 407-394-0171",
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