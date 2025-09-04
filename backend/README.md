# BRfix Backend - Email Service

Este backend Flask gerencia o envio de formulários de contato para o email Zoho.

## Configuração

### Desenvolvimento Local
1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Configure as variáveis no código (já configurado):
- SMTP_HOST: smtp.zoho.com
- SMTP_PORT: 465
- SMTP_USER: contact@davensolutions.com
- SMTP_PASS: iQ6fsWWDbBLE

3. Execute o servidor:
```bash
python app.py
```

### Estrutura dos Endpoints

**POST /send-email**
Recebe dados do formulário e envia email formatado.

Campos obrigatórios:
- name: Nome completo
- email: Email do cliente
- phone: Telefone
- address: Zip Code
- description: Descrição do projeto

Campos opcionais:
- observations: Observações adicionais

**GET /health**
Endpoint de verificação de saúde do serviço.

## Deploy
Para produção, configure as variáveis de ambiente conforme necessário e ajuste o CORS para seu domínio específico.