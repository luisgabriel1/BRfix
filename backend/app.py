# backend/start-backend.py
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
import smtplib
import logging

# Carrega .env (variáveis)
load_dotenv()

ZOHO_EMAIL = os.getenv("ZOHO_EMAIL")
ZOHO_PASSWORD = os.getenv("ZOHO_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL", ZOHO_EMAIL)
FLASK_PORT = int(os.getenv("FLASK_PORT", 3001))
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")

# Configura logging simples
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend")

app = Flask(__name__)
# Configura CORS — restrinja ALLOWED_ORIGINS para produção
CORS(app, origins=ALLOWED_ORIGINS.split(","))

@app.route("/send-form", methods=["POST"])
def send_form():
    """
    Endpoint para receber JSON do frontend e enviar por e-mail via Zoho SMTP.
    Espera JSON com ao menos: name, email, message
    """
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"success": False, "error": "Sem JSON no corpo"}), 400

        # Campos comuns; adapte conforme o seu formulário
        nome = data.get("name") or data.get("nome") or "Sem nome"
        email_cliente = data.get("email") or data.get("Email")
        mensagem = data.get("message") or data.get("mensagem") or ""

        # Validações simples
        if not email_cliente:
            return jsonify({"success": False, "error": "E-mail do cliente é obrigatório"}), 400

        # Monta a mensagem (plain text + html opcional)
        subject = f"BRfix - Novo formulário recebido de {nome}"
        body_text = f"""
        Novo formulário recebido:
        Nome: {nome}
        Email: {email_cliente}
        Mensagem:
        {mensagem}
        """

        msg = EmailMessage()
        msg["Subject"] = subject
        # From precisa ser o seu email Zoho (autenticado)
        msg["From"] = ZOHO_EMAIL
        msg["To"] = RECEIVER_EMAIL
        # Reply-To para que ao responder você vá direto para o cliente
        msg["Reply-To"] = email_cliente
        # Corpo em texto
        msg.set_content(body_text)

        # (Opcional) corpo HTML — com fallback para texto
        html_body = f"""
        <html>
        <body>
          <h2>Novo formulário recebido</h2>
          <p><strong>Nome:</strong> {nome}</p>
          <p><strong>Email:</strong> {email_cliente}</p>
          <p><strong>Mensagem:</strong><br/>{mensagem.replace('\\n', '<br/>')}</p>
        </body>
        </html>
        """
        msg.add_alternative(html_body, subtype="html")

        # Envia via Zoho SMTP (SSL)
        smtp_host = "smtp.zoho.com"
        smtp_port = 465  # porta SSL do Zoho

        logger.info("Conectando ao servidor SMTP...")
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20) as smtp:
            smtp.login(ZOHO_EMAIL, ZOHO_PASSWORD)
            smtp.send_message(msg)

        logger.info("Email enviado com sucesso para %s", RECEIVER_EMAIL)
        return jsonify({"success": True, "message": "Formulário enviado com sucesso"}), 200

    except smtplib.SMTPAuthenticationError as auth_err:
        logger.exception("Erro de autenticação SMTP")
        return jsonify({"success": False, "error": "Erro de autenticação SMTP. Confira ZOHO_EMAIL e ZOHO_PASSWORD"}), 500
    except Exception as e:
        logger.exception("Erro ao enviar email")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    logger.info("Iniciando backend na porta %s", FLASK_PORT)
    app.run(host="0.0.0.0", port=FLASK_PORT, debug=True)
