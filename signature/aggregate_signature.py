from bls.scheme import *
import pickle
import sys
import os
import json
import glob
import configargparse
from sig_email_helper import send_secret_key_email
from bplib.bp import G1Elem, G2Elem
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
    p.add_argument('-d', '--working_directory', type=str, default='.', help='the main working directory - to find verify_key.txt')
    p.add_argument('-o', '--origin_directory', type=str, default='.', help='the directory for origin certificates')
    p.add_argument('-w', '--all_certificates_directory', type=str, default='.', help='the directories for signed certificates to be aggregated')
    args, _ = p.parse_known_args()
    return args

def aggr_pdf(pdfname, pdfpaths, origin_directory):
    params = setup()
    (G, o, g1, g2, e) = params

    # 从多个文件中读出所有签名
    sigs = []
    for path in pdfpaths:
        pdf = PdfReader(path + os.path.sep + pdfname)
        try:
            sig_str:str =  pdf.Info.signature
            sig_str = sig_str[1:-1]
            sig_bytes = base64.b64decode( sig_str.encode("utf-8") )
            sig_g1elem = G1Elem.from_bytes(sig_bytes,G)
        except:
            sig_g1elem = None
        sigs.append(sig_g1elem)

    print('all_sigs:',sigs)

    # 聚合所有签名
    sigma = aggregate_sigma(params, sigs)
    print('type sigma:',type(sigma))
    sigma_bytes = sigma.export()
    sigma_str = base64.b64encode(sigma_bytes).decode()

    # 将聚合后的签名写回运行路径中新建的以blockstackid命名的pdf中
    pdf = PdfReader(origin_directory + os.path.sep + pdfname)
    metadata_new = PdfDict(signature = sigma_str)
    pdf.Info.update(metadata_new)
    PdfWriter().write(pdfname, pdf)
        
def aggr_all_pdf(conf):
    origin_directory = conf.origin_directory
    cert_files = glob.glob(origin_directory + os.path.sep + "*.pdf")  #所有路径+名字的list
    # print("cert_files:", cert_files)
    pdf_names = []
    for cert in cert_files:
        pdf_names.append(cert.split("/")[-1])
    # print("pdf_names", pdf_names)

    directories = conf.all_certificates_directory.split(",")
    # print("directories:",directories)
    
    for name in pdf_names:
        aggr_pdf(name, directories, origin_directory)

def main():
    if sys.version_info.major < 3:
        sys.stderr.write('Python 3 is required!')
        sys.exit(1)

    conf = load_config()
    aggr_all_pdf(conf)

    print('aggregate success!')


if __name__ == "__main__":
    main()