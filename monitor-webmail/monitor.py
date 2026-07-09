#!/usr/bin/env python3
"""
Monitor de disponibilidad de una página web (ej. tu webmail).
Envía un correo de notificación por Gmail SMTP si la página no responde
correctamente.

Variables de entorno requeridas (se configuran como Secrets en GitHub):
- TARGET_URL:      URL de la página a monitorear (ej. https://correo.midominio.com)
- GMAIL_USER:      Tu dirección de Gmail que envía el correo
- GMAIL_APP_PASS:  Contraseña de aplicación de Gmail (NO tu contraseña normal)
- NOTIFY_EMAIL:    Dirección de Gmail que RECIBE la notificación
                    (puede ser la misma que GMAIL_USER)

Lógica de reintentos:
- El workflow de GitHub Actions corre este script cada 10 minutos normalmente.
- Si un chequeo falla, el script NO termina ahí: reintenta cada 90 segundos
  dentro de la misma ejecución, hasta un máximo de 4 intentos consecutivos.
- Si en algún reintento la página vuelve a responder bien, se considera
  recuperada y no se manda correo (se retoma el ciclo normal de 10 min).
- Si falla 4 veces seguidas (la primera + 3 reintentos), se manda el correo
  de alerta.

Opcional:
- TIMEOUT_SECONDS:  Timeout de cada petición HTTP (default 10)
- EXPECTED_STATUS:  Código de estado esperado (default 200)
- RETRY_SECONDS:    Segundos de espera entre reintentos (default 90)
- MAX_ATTEMPTS:     Intentos consecutivos antes de alertar (default 4)
"""

import os
import sys
import time
import smtplib
import ssl
from email.mime.text import MIMEText
from datetime import datetime, timezone

import requests


def check_site(url: str, timeout: int, expected_status: int):
    """Devuelve (esta_arriba: bool, detalle: str)."""
    try:
        resp = requests.get(url, timeout=timeout, allow_redirects=True)
        if resp.status_code == expected_status:
            return True, f"OK - código {resp.status_code}"
        else:
            return False, f"Código de estado inesperado: {resp.status_code}"
    except requests.exceptions.Timeout:
        return False, f"Timeout después de {timeout}s"
    except requests.exceptions.ConnectionError as e:
        return False, f"Error de conexión: {e}"
    except requests.exceptions.RequestException as e:
        return False, f"Error al hacer la petición: {e}"


def send_email(gmail_user: str, gmail_pass: str, to_email: str, subject: str, body: str):
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = gmail_user
    msg["To"] = to_email

    context = ssl.create_default_context()
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls(context=context)
        server.login(gmail_user, gmail_pass)
        server.sendmail(gmail_user, [to_email], msg.as_string())


def main():
    url = os.environ.get("TARGET_URL")
    gmail_user = os.environ.get("GMAIL_USER")
    gmail_pass = os.environ.get("GMAIL_APP_PASS")
    notify_email = os.environ.get("NOTIFY_EMAIL")
    timeout = int(os.environ.get("TIMEOUT_SECONDS", "10"))
    expected_status = int(os.environ.get("EXPECTED_STATUS", "200"))
    retry_seconds = int(os.environ.get("RETRY_SECONDS", "90"))
    max_attempts = int(os.environ.get("MAX_ATTEMPTS", "4"))

    missing = [name for name, val in [
        ("TARGET_URL", url),
        ("GMAIL_USER", gmail_user),
        ("GMAIL_APP_PASS", gmail_pass),
        ("NOTIFY_EMAIL", notify_email),
    ] if not val]

    if missing:
        print(f"Faltan variables de entorno: {', '.join(missing)}")
        sys.exit(1)

    attempt = 1
    is_up, detail = check_site(url, timeout, expected_status)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"[{now}] Intento {attempt}/{max_attempts} - {url} -> "
          f"{'ARRIBA' if is_up else 'CAÍDA'} ({detail})")

    # Si falla el primer intento, reintenta cada RETRY_SECONDS hasta
    # max_attempts en total, o hasta que vuelva a responder bien.
    while not is_up and attempt < max_attempts:
        time.sleep(retry_seconds)
        attempt += 1
        is_up, detail = check_site(url, timeout, expected_status)
        now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        print(f"[{now}] Intento {attempt}/{max_attempts} - {url} -> "
              f"{'ARRIBA' if is_up else 'CAÍDA'} ({detail})")

    if is_up:
        if attempt > 1:
            print(f"Se recuperó en el intento {attempt}. No se envía correo.")
        return

    # Falló en todos los intentos consecutivos: se envía la alerta.
    subject = f"⚠️ Alerta: {url} parece estar caída"
    body = (
        f"Se detectó que tu página no respondió correctamente en "
        f"{max_attempts} intentos consecutivos (cada ~{retry_seconds}s).\n\n"
        f"URL: {url}\n"
        f"Fecha/hora del último intento: {now}\n"
        f"Detalle del último intento: {detail}\n\n"
        f"Este correo fue generado automáticamente por tu monitor."
    )
    try:
        send_email(gmail_user, gmail_pass, notify_email, subject, body)
        print("Correo de alerta enviado.")
    except Exception as e:
        print(f"No se pudo enviar el correo de alerta: {e}")
        sys.exit(1)
    # Código distinto de 0 para que el job se marque en rojo en Actions.
    # Quítalo si no quieres que se vea como "fallido".
    sys.exit(2)


if __name__ == "__main__":
    main()
