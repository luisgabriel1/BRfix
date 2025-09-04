from flask import Flask, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
from dotenv import load_dotenv
import smtplib
import os

# Carrega variáveis do .env (apenas ambiente local)
load_dotenv()

# Lê as variáveis de ambiente (Zoho)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.zoho.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))  # 465 (SSL) ou 587 (TLS c/ starttls)
SMTP_USER = os.getenv("SMTP_USER")              # ex: contact@davensolutions.com
SMTP_PASS = os.getenv("SMTP_PASS")              # App Password Zoho
TO_EMAIL  = os.getenv("TO_EMAIL", SMTP_USER)    # para quem enviar (você)

app = Flask(__name__)

# Em dev pode deixar aberto; em produção você pode restringir p/ seu domínio da Vercel
CORS(app)  
# Exemplo mais restrito:
# CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://SEU-DOMINIO.vercel.app"]}})

@app.route("/send-email", methods=["POST", "OPTIONS"])
def send_email():
    # Pré-flight CORS
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    required = ["name", "email", "phone", "address", "description"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"success": False, "error": f"Missing: {', '.join(missing)}"}), 400

    # Monta o e-mail
    msg = EmailMessage()
    msg["Subject"] = f"New Quote Request — {data.get('name')}"
    msg["From"] = SMTP_USER
    msg["To"] = TO_EMAIL
    if data.get("email"):
        msg["Reply-To"] = data["email"]

    body = f"""New Quote Request

Full Name: {data.get('name')}
Email: {data.get('email')}
Phone: {data.get('phone')}
Zip Code: {data.get('address')}

Project Description:
{data.get('description')}

Additional Notes / Visit Observations:
{data.get('observations', '')}
"""
    msg.set_content(body)

    try:
        # SSL direto (porta 465)
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)

        return jsonify({"success": True}), 200

    except Exception as e:
        # Dica: ver o log de erro no Render se algo falhar
        return jsonify({"success": False, "error": str(e)}), 500

@app.get("/health")
def health():
    return {"status": "ok"}
