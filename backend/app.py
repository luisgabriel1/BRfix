from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

@app.route("/send-email", methods=["POST"])
def send_email():
    data = request.get_json(force=True)  # força a leitura mesmo que o header esteja faltando
    if not data:
        return jsonify({"success": False, "error": "No data received"}), 400


    sender_email = "contact@davensolutions.com"   # remetente (sua conta de envio)
    receiver_email = "contact@davensolutions.com" # destinatário (você mesmo)
    password = "iQ6fsWWDbBLE"

    # título do email
    subject = f"New Quote Request from {data['name']}"

    # corpo do email com todos os campos do formulário
    body = f"""
    📩 New Quote Request Received

    Full Name: {data.get('name')}
    Email: {data.get('email')}
    Phone: {data.get('phone')}
    Zip Code: {data.get('address')}
    Project Description:
    {data.get('description')}

    Additional Notes / Visit Observations:
    {data.get('observations')}
    """

    # configura a mensagem
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg["Reply-To"] = data.get("email")

    msg.attach(MIMEText(body, "plain"))

    try:
        # se for Zoho
        with smtplib.SMTP_SSL("smtp.zoho.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, msg.as_string())

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
