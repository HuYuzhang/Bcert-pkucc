from os import path
from config import load_config
from bls.scheme import *
import sys
import os
from bplib.bp import G1Elem,G2Elem
import base64
from pdfrw import PdfReader
from tkinter import Tk, simpledialog, filedialog, messagebox

def verify_sig(pdfname, original_file, public_key_file):
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
    print('origin:',original_file)
    m = []
    with open(original_file, 'rb') as cert:
        content = cert.read()
        # content : bytes   m:list
        m = list(content)

    with open(public_key_file, "r") as f:
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

    origin_pdfname = path.join(conf.origin_directory, pdfname.split("/")[-1])
    public_key_file = os.path.join(conf.working_directory, 'verify_key.txt')
    # pdfname = '/Users/jasmine/Documents/Bcert-pkucc/signature/jasmin3q.id.blockstack.pdf'
    # pdfname = '/Users/jasmine/Documents/Bcert-pkucc/blockchain-certificates/pku2021/certificates1/jasmin3q.id.blockstack.pdf'
    res = verify_sig(pdfname, origin_pdfname, public_key_file)

    print('validate success! result = ',res)

def gui():

    top = Tk()
    top.withdraw()

    file_path = filedialog.askopenfilename(title="选择要验证的PDF文件")
    if not file_path:
        return
    
    original_file_path = filedialog.askopenfilename(title="选择证书原文件")
    if not original_file_path:
        return

    public_key_file = filedialog.askopenfilename(title="选择写有验证用公钥的文件")
    if not public_key_file:
        return
    
    if verify_sig(file_path, original_file_path, public_key_file):
        messagebox.showinfo("验证成功", "证书有效。")
    else:
        messagebox.showerror("验证失败", "证书无效。")

if __name__ == "__main__":
    # main()
    gui()