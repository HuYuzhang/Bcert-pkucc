from bls.scheme import *
import pickle
import sys
import os
import json
import configargparse
from sig_email_helper import send_secret_key_email
from bplib.bp import G2Elem
import base64

def load_config():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    default_config = os.path.join(base_dir, 'generate_config.ini')
    default_config = '/Users/jasmine/Documents/Bcert-pkucc/signature/generate_config.ini'
    p = configargparse.getArgumentParser(default_config_files=[default_config])
    p.add('-c', '--config', required=False, is_config_file=True, help='config file path')
    p.add_argument('-d', '--working_directory', type=str, default='.', help='the main working directory - all paths/files are relative to this')
    p.add_argument('-n', '--signer_num', type=int, default=3, help='the number of all the signers')
    p.add_argument('-t', '--valid_num', type=int, default=2,help='the number of the needed signer to form a valid signature')
    p.add_argument('-s', '--signer', type=str, help='the information of all the signers')

    args, _ = p.parse_known_args()
    return args

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