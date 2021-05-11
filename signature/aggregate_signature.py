from config import load_config
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

def aggr_pdf(pdfname, pdfpaths, origin_directory, output_dir):
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

    # 聚合所有签名
    sigma = aggregate_sigma(params, sigs)
    sigma_bytes = sigma.export()
    sigma_str = base64.b64encode(sigma_bytes).decode()


    # 将聚合后的签名写回运行路径中新建的以blockstackid命名的pdf中
    pdf = PdfReader(os.path.join(origin_directory, pdfname))
    metadata_new = PdfDict(signature = sigma_str)
    pdf.Info.update(metadata_new)
    PdfWriter(trailer=pdf).write(os.path.join(output_dir, pdfname))
        
def aggr_all_pdf(conf):
    origin_directory = conf.origin_directory
    cert_files = glob.glob(os.path.join(origin_directory, "*.pdf"))  #所有路径+名字的list
    # print("cert_files:", cert_files)
    pdf_names = []
    for cert in cert_files:
        pdf_names.append(cert.split("/")[-1])
    # print("pdf_names", pdf_names)

    directories = conf.all_certificates_directory.split(",")
    # print("directories:",directories)
    
    for name in pdf_names:
        aggr_pdf(name, directories, origin_directory, conf.aggr_output_directory)

def main():
    if sys.version_info.major < 3:
        sys.stderr.write('Python 3 is required!')
        sys.exit(1)

    conf = load_config()
    aggr_all_pdf(conf)

    print('aggregate success!')


if __name__ == "__main__":
    main()