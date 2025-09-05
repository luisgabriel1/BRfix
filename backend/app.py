from flask import Flask, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
from dotenv import load_dotenv
import smtplib
import os
import re

# Carrega variáveis do .env (apenas ambiente local)
load_dotenv()

# Configurações do Zoho Email
SMTP_HOST = "smtp.zoho.com"
SMTP_PORT = 465  # SSL
SMTP_USER = os.getenv("ZOHO_EMAIL", "contact@davensolutions.com")
SMTP_PASS = os.getenv("ZOHO_PASS", "iQ6fsWWDbBLE")
TO_EMAIL = os.getenv("RECEIVER_EMAIL", "contact@davensolutions.com")

app = Flask(__name__)
CORS(app)

@app.route("/send-email", methods=["POST", "OPTIONS"])
def send_email():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    required = ["name", "email", "phone", "address", "description"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"success": False, "error": f"Missing: {', '.join(missing)}"}), 400

    # Valida e-mail do cliente
    email_cliente = data.get("email", "").strip()
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_regex, email_cliente):
        return jsonify({"success": False, "error": "Invalid client email"}), 400

    # Monta o e-mail
    msg = EmailMessage()
    msg["Subject"] = f"🏠 New Quote Request — {data.get('name')}"
    msg["From"] = SMTP_USER
    msg["To"] = TO_EMAIL
    msg["Reply-To"] = email_cliente  # usa o email do cliente

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
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)

        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
