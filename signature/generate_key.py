from config import load_config
from bls.scheme import *
import sys
import os
import json
from sig_email_helper import send_secret_key_email
import base64

def generate(conf):

    params = setup()

    (sk, vk) = ttp_keygen(params, conf.valid_num, conf.signer_num)
    aggr_vk = aggregate_vk(params, vk)

    # 公钥存储在本地verify_key.txt中
    vk_directory = os.path.join(conf.working_directory, 'verify_key.txt')
    vk_bytes = aggr_vk.export()
    vk_str = base64.b64encode(vk_bytes).decode()
    with open(vk_directory, "w") as f:
        f.write(vk_str)

    # 私钥通过邮箱发送至签名者本人
    receivers = json.loads(str(conf.signer))
    recv = receivers["signer"]
    for i in range(len(recv)):
        send_secret_key_email(recv[i]['email'],recv[i]['name'],sk[i])

def main():
    if sys.version_info.major < 3:
        sys.stderr.write('Python 3 is required!')
        sys.exit(1)

    conf = load_config()
    generate(conf)

    print('generate success!')


if __name__ == "__main__":
    main()