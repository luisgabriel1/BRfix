from flask import Flask, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
from dotenv import load_dotenv
import smtplib
import os

# Carrega variáveis do .env (apenas ambiente local)
load_dotenv()

# Configurações do Zoho Email
SMTP_HOST = "smtp.zoho.com"
SMTP_PORT = 465  # SSL
SMTP_USER = "contact@davensolutions.com"
SMTP_PASS = "iQ6fsWWDbBLE"  # App Password Zoho
TO_EMAIL = "contact@davensolutions.com"  # Seu email para receber as mensagens

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

    # Monta o e-mail com formatação profissional
    msg = EmailMessage()
    msg["Subject"] = f"🏠 New Quote Request — {data.get('name')}"
    msg["From"] = SMTP_USER
    msg["To"] = TO_EMAIL
    if data.get("email"):
        msg["Reply-To"] = data["email"]

    body = f"""
═══════════════════════════════════════════════════════════════
📧 NEW QUOTE REQUEST RECEIVED - BRFIX
═══════════════════════════════════════════════════════════════

👤 CLIENT INFORMATION:
───────────────────────────────────────
   Full Name: {data.get('name')}
   Email: {data.get('email')}
   Phone: {data.get('phone')}
   Zip Code: {data.get('address')}

🏗️ PROJECT DETAILS:
───────────────────────────────────────
{data.get('description')}

📝 ADDITIONAL NOTES / VISIT OBSERVATIONS:
───────────────────────────────────────
{data.get('observations', 'None provided')}

═══════════════════════════════════════════════════════════════
📞 FOLLOW-UP ACTIONS:
   • Reply to client within 24 hours
   • Schedule site visit if needed
   • Prepare detailed quote

💡 REMINDER: Client expects response within 24 hours
   Contact info: {data.get('phone')} | {data.get('email')}
═══════════════════════════════════════════════════════════════
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
