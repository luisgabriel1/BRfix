# 🏠 BRfix - Instruções de Configuração

## ✅ Configuração Completa

### 📧 Email já configurado:
- **Email Zoho**: contact@davensolutions.com
- **App Password**: Configurado no backend
- **Servidor SMTP**: smtp.zoho.com:465 (SSL)

### 🚀 Como executar:

#### 1. Backend (servidor de email):
```bash
# Opção 1 - Script automático:
python start-backend.py

# Opção 2 - Manual:
cd backend
pip install -r requirements.txt
python app.py
```

#### 2. Frontend (interface):
```bash
# Em outro terminal:
npm run dev
```

### 🔧 Funcionalidades implementadas:

✅ **Formulário de contato** - Todos os campos funcionando  
✅ **Envio de email** - Configurado com Zoho  
✅ **Validação** - Campos obrigatórios verificados  
✅ **Feedback visual** - Loading states e mensagens toast  
✅ **Formatação profissional** - Email bem estruturado  
✅ **Reply-to** - Cliente pode responder diretamente  
✅ **Galeria com links** - Fotos linkam para Facebook  
✅ **Informações atualizadas** - Nome BRfix, horários, etc  

### 📝 Teste do formulário:

1. Preencha todos os campos obrigatórios (*)
2. Clique em "Submit Quote Request"
3. Aguarde a mensagem de confirmação
4. Verifique o email: contact@davensolutions.com

### 🐛 Troubleshooting:

**Problema**: Email não enviando
- ✅ Verificar se o backend está rodando na porta 5000
- ✅ Verificar conexão com internet
- ✅ Conferir credenciais Zoho no backend/app.py

**Problema**: Erro de CORS
- ✅ Backend já configurado com CORS liberado

**Problema**: Formulário não responde
- ✅ Verificar console do navegador (F12)
- ✅ Confirmar que backend está respondendo em localhost:5000

### 📧 Formato do email que você receberá:

```
🏠 New Quote Request — [Nome do Cliente]

═══════════════════════════════════════
📧 NEW QUOTE REQUEST RECEIVED - BRFIX
═══════════════════════════════════════

👤 CLIENT INFORMATION:
   Full Name: João Silva
   Email: joao@email.com
   Phone: +1 407-123-4567
   Zip Code: 33896

🏗️ PROJECT DETAILS:
Renovação completa da cozinha...

📝 ADDITIONAL NOTES:
Cliente prefere horário manhã...
═══════════════════════════════════════
```

## 🎯 Sistema pronto para produção!