import smtplib
from email.mime.text import MIMEText
from email.header import Header

host = "smtp.qq.com"
user = "cqwzcjd@vip.qq.com"
password = "rwuzyyidadfzbbef"
sender_name = "北京大学"

def send_cert_email(receiver: str, receiver_name: str, hash: str):
    message = MIMEText(f"""
       {receiver_name} 同学您好：
            北京大学为您颁发了一张证书。
            您可以在任何时候使用以下的代码（hash值）到 https://bcert.pku.edu.cn 网站上下载此证书。
            
            {hash}
    """, "plain", "utf-8")

    message['From'] = Header(sender_name, 'utf-8')
    message['To'] = Header(receiver_name, 'utf-8')
    message['Subject'] = Header("北京大学证书信息", 'utf-8')

    smtp = smtplib.SMTP_SSL(host)
    try:
        smtp.ehlo(host)
        smtp.login(user, password)
        smtp.sendmail(user, receiver, message.as_string())
    finally:
        smtp.quit()
    
    