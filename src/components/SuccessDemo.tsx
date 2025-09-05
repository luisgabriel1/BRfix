import { CheckCircle, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SuccessDemo = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="max-w-sm shadow-lg border-2 border-green-500 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-800">Sistema Funcionando!</h3>
              <p className="text-sm text-green-700">
                Formulário captura dados no console (F12)
              </p>
              <div className="flex items-center mt-2 space-x-4 text-xs text-green-600">
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  <span>+1 407-394-0171</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  <span>BRfix</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessDemo;