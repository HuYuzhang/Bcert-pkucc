from bls.scheme import *
import pickle
import sys
import os
import json
import configargparse
from sig_email_helper import send_secret_key_email
from bplib.bp import G1Elem,G2Elem
import base64
from pdfrw import PdfReader, PdfWriter, PdfDict

def load_config():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    # print(base_dir) #/Users/jasmine/Documents/Bcert-pkucc
    default_config = os.path.join(base_dir, 'generate_config.ini')
    default_config = '/Users/jasmine/Documents/Bcert-pkucc/signature/generate_config.ini'
    p = configargparse.getArgumentParser(default_config_files=[default_config])
    p.add('-c', '--config', required=False, is_config_file=True, help='config file path')
    p.add_argument('-d', '--working_directory', type=str, default='.', help='the main working directory - all paths/files are relative to this')
    p.add_argument('-v', '--verify_directory', type=str, default='.', help='the main working directory - all paths/files are relative to this')

    args, _ = p.parse_known_args()
    return args

def verify_sig(pdfname, conf):
    params = setup()
    (G, o, g1, g2, e) = params
    # 读取签名
    pdf = PdfReader(pdfname)
    # try:
    sigma_str:str =  pdf.Info.signature
    sigma_str = sigma_str[1:-1]
    print('sigma_str:',sigma_str)
    sigma_bytes = base64.b64decode( sigma_str.encode("utf-8") )
    sigma_g1elem = G1Elem.from_bytes(sigma_bytes,G)
    # except:
        # return False

    # 获取原文件m
    origin_certificates_directory = '/Users/jasmine/Documents/Bcert-pkucc/blockchain-certificates/pku2021/certificates'
    origin_pdfname = origin_certificates_directory + os.path.sep  +pdfname.split("/")[-1]
    print('origin:',origin_pdfname)
    m = []
    with open(origin_pdfname, 'rb') as cert:
        content = cert.read()
        # content : bytes   m:list
        m = list(content)

    # 读取公钥 此处公钥存储在本地verify_key.txt中
    vk_directory = os.path.join(conf.working_directory, 'verify_key.txt')
    with open(vk_directory,"r") as f:
        vk_str = f.read()
    vk_bytes = base64.b64decode(vk_str.encode())
    aggr_vk = G2Elem.from_bytes(vk_bytes, params[0])
    
    return verify(params, aggr_vk, sigma_g1elem, m)
    
def main():
    if sys.version_info.major < 3:
        sys.stderr.write('Python 3 is required!')
        sys.exit(1)

    conf = load_config()
    pdfname = conf.verify_directory 
    # pdfname = '/Users/jasmine/Documents/Bcert-pkucc/signature/jasmin3q.id.blockstack.pdf'
    # pdfname = '/Users/jasmine/Documents/Bcert-pkucc/blockchain-certificates/pku2021/certificates1/jasmin3q.id.blockstack.pdf'
    res = verify_sig(pdfname, conf)

    print('validate success! result = ',res)


if __name__ == "__main__":
    main()