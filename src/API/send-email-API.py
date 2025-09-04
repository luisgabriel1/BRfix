import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(request, response):
    if request.method != "POST":
        return response.status(405).send("Method not allowed")

    data = request.json()

    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASS = os.getenv("SMTP_PASS")
    TO_EMAIL  = os.getenv("TO_EMAIL")

    subject = f"New Quote Request from {data.get('name','Unknown')}"
    body = f"""
    📩 New Quote Request Received

    Full Name: {data.get('name')}
    Email: {data.get('email')}
    Phone: {data.get('phone')}
    Zip Code: {data.get('address')}
    Project Description:
    {data.get('description')}

    Additional Notes:
    {data.get('observations')}
    """

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = TO_EMAIL
    msg["Subject"] = subject
    msg["Reply-To"] = data.get("email","")
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, TO_EMAIL, msg.as_string())
        return response.status(200).json({"success": True})
    except Exception as e:
        return response.status(500).json({"success": False, "error": str(e)})
