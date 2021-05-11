import smtplib
from email.mime.text import MIMEText
from email.header import Header

host = "smtp.qq.com"
user = "cqwzcjd@vip.qq.com"
password = "rwuzyyidadfzbbef"
sender_name = "北京大学"

def send_secret_key_email(receiver, receiver_name, key):
    message = MIMEText(f"""
       签名者 {receiver_name} ，您好：
            教育联盟多方签名系统为你生成私钥如下：
            {key}
            您可以在系统指定时间内使用该私钥对您认可的证书进行签名，证书将在后续邮件中通知。
            请对该私钥进行妥善保管，建议将其存储在安全的地方并删除本邮件。

    """, "plain", "utf-8")

    message['From'] = Header(sender_name, 'utf-8')
    message['To'] = Header(receiver_name, 'utf-8')
    message['Subject'] = Header("教育联盟多方签名系统", 'utf-8')

    smtp = smtplib.SMTP_SSL(host)
    try:
        smtp.ehlo(host)
        smtp.login(user, password)
        smtp.sendmail(user, receiver, message.as_string())
    finally:
        smtp.quit()
    