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

            您也可以点击这个链接将此份证书保存到您的blockstack账号中，以后可以快速下载使用。

            https://bcert.pku.edu.cn/save/{hash}
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
    
def send_secret_key_email(receiver, receiver_name, key):
    message = MIMEText(f"""
       签名者 {receiver_name} ，您好：
            教育联盟多方签名系统为你生成私钥如下：
            {key}
            您可以在系统指定时间内登陆 https://bcert.pku.edu.cn 网站，并输入该私钥对您认可的证书进行签名。
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
    