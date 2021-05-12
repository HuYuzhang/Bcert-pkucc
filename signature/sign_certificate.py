from config import load_config
from bls.scheme import *
import sys
import os
import glob
import base64
from tkinter import Tk, simpledialog, filedialog, messagebox
from pdfrw import PdfReader, PdfWriter, PdfDict
from petlib.bn import Bn

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


def sign_certificates(certificates_dir, secret_key):
    # certificates_directory = '/Users/jasmine/Documents/Bcert-pkucc/blockchain-certificates/pku2021/certificates'
    cert_files = glob.glob(certificates_dir + os.path.sep + "*.pdf")  #所有路径+名字的list
    print(secret_key)
    print(type(secret_key))
    for cert in cert_files:
        sign_pdf(cert, secret_key)

def main():
    conf = load_config()
    sign_certificates(conf.certificates_directory, conf.secret_key)

    print('sign success!')

def gui():
    top = Tk()
    top.withdraw()

    folder: str = filedialog.askdirectory(title="选择证书目录")

    if not folder:
        return

    secret_key: str = simpledialog.askstring("私钥", "请输入您的私钥")

    if not secret_key:
        return

    sign_certificates(folder, secret_key)

    messagebox.showinfo("签名成功。", "签名完成。")



if __name__ == "__main__":
    # main()
    gui()