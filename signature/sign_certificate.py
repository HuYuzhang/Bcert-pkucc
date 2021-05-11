from bls.scheme import *
import pickle
import sys
import os
import json
import glob
import configargparse
from sig_email_helper import send_secret_key_email
from bplib.bp import G2Elem
import base64
from pdfrw import PdfReader, PdfWriter, PdfDict
from petlib.bn import Bn

def load_config():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    # print(base_dir) #/Users/jasmine/Documents/Bcert-pkucc
    default_config = os.path.join(base_dir, 'config.ini')
    default_config = '/Users/jasmine/Documents/Bcert-pkucc/signature/config.ini'
    p = configargparse.getArgumentParser(default_config_files=[default_config])
    p.add('-c', '--config', required=False, is_config_file=True, help='config file path')
    p.add_argument('-w', '--certificates_directory', type=str, default='.', help='the certificates directory - all certificates are stored here')
    p.add_argument('-k', '--secret_key', type=str, default='.', help='the secret key used in signing ')
    args, _ = p.parse_known_args()
    return args

def sign_pdf(pdfname, sk):
    # 这一版仅对原件做签名，不考虑待签名的证书已有签名的情况
    print('signing',pdfname)

    # 先读出sigs 然后置为空写回
    # pdf = PdfReader(pdfname)
    # print(pdf.Info)
    # try:
    #     sigs =  pdf.Info.signature #sigs: <class 'pdfrw.objects.pdfarray.PdfArray'>
    # except:
    #     sigs = []
    # metadata = PdfDict(signature = [])
    # pdf.Info.update(metadata)
    # PdfWriter().write(pdfname, pdf)

    sig = ''
    # 根据pdf名读取其中内容至m中
    with open(pdfname, 'rb') as cert:
        content = cert.read()
        # content : bytes   m:list
        m = list(content)
        params = setup()
        sk_bn = Bn.from_decimal(sk)
        sig = sign(params,sk_bn,m)
        
    # 将sig写回pdf metadata域
    # sigs.append(sig)
    sig_bytes = sig.export()
    sig_str = base64.b64encode(sig_bytes).decode()
    metadata_new = PdfDict(signature = sig_str)
    """ Import a G1 point from bytes.    
            Export:
                >>> G = BpGroup()
                >>> g1 = G.gen1()
                >>> buf = g1.export()
                >>> g1p = G1Elem.from_bytes(buf, G)
                >>> g1 == g1p
                True
    """
    pdf = PdfReader(pdfname)
    pdf.Info.update(metadata_new)
    PdfWriter().write(pdfname, pdf)


def sign_certificates(conf):
    # certificates_directory = '/Users/jasmine/Documents/Bcert-pkucc/blockchain-certificates/pku2021/certificates'
    certificates_directory = conf.certificates_directory
    cert_files = glob.glob(certificates_directory + os.path.sep + "*.pdf")  #所有路径+名字的list
    print(conf.secret_key)
    print(type(conf.secret_key))
    for cert in cert_files:
        sign_pdf(cert, conf.secret_key)

def main():
    if sys.version_info.major < 3:
        sys.stderr.write('Python 3 is required!')
        sys.exit(1)

    conf = load_config()
    sign_certificates(conf)

    print('sign success!')


if __name__ == "__main__":
    main()