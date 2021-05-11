
# from .email_helper import send_secret_key_email
from email_helper import send_secret_key_email
receivers = [
    {'email':'591723734@qq.com',
     'name':'jasmine1'},
    {'email':'jasmin3q@qq.com',
     'name':'jasmine2'},
    {'email':'2001213082@stu.pku.edu.cn',
     'name':'jasmine3'}]

# 725504716079142780167745385020733664105288896579667601298660471181302558733
# 12336393741993223209733401568817391238633389642509394735727528889434015129617
# 7149174036891471354358253610382314903401910785034369121128018443521157484552

def generate_key(pdfname, sk):
    params = setup()
    # return (G,o,g1,g2,e) G:group o:order g1,g2 :generator e:pair
    (sk, vk) = ttp_keygen(params, conf.valid_num, conf.signer_num)
    aggr_vk = aggregate_vk(params, vk)

def sign_pdf(pdfname, sk):
    #根据pdf名读取其中内容至m中
    #读取params
    sig = sign(params,sk,m)
    #将sig写回pdf metadata域

def aggregate_sigs(pdfname):
    #将所有签名读出至sigs
    sigs=[]
    sigma = aggregate_sigma(params, sigs)

def verify_pdf(pdfname, aggr_vk, sigma, m):
    #aggr_vk为聚合公钥
    #sigma为聚合后的签名，直接从pdf中读取即可
    #m为原始pdf
    assert verify(params, aggr_vk, sigma, m)


generate_key(2,3,receivers)



def sign_pdf(pdfname, sk):
    print('signing',pdfname)

    pdf = PdfReader(pdfname)
    info = pdf.Info
    metadata = json.loads( pdf.Info.metadata.decode() )
    print(metadata)
    print(type(metadata))
    pdf.Info.update('')
    sig = ''
    metadata['signature'] = []
    #根据pdf名读取其中内容至m中
    with open(pdfname, 'rb') as cert:
        content = cert.read()
        m = list(content)
        # content : bytes
        # print('type content:',type(m))
        # m_str = base64.b64encode(m).decode()
        print(m)
        #读取params
        params = setup()
        sig = sign(params,Bn(sk),m)
        
    #将sig写回pdf metadata域
    metadata['signatures'].append(sig)
    pdf.Info.update(metadata)
    PdfWriter().write(pdfname, pdf)
        
        # proof = json.dumps( cp.get_receipt(ind, txid) )
        # metadata = PdfDict(chainpoint_proof=proof)
        # pdf = PdfReader(val)
        # pdf.Info.update(metadata)
        # PdfWriter().write(val, pdf)




def sign_pdf(pdfname, sk):
    print('signing',pdfname)
    # 先读出sigs 然后置为空写回
    pdf = PdfReader(pdfname)
    print(pdf.Info)

    metadata_object = json.loads( pdf.Info.metadata.decode() )
    if metadata_object.__contains__('signature'):
        sigs = metadata_object['signature']
    else:
        sigs = []
        metadata_object['signature'] = []

    metadata_object['signature'] = []
    metadata = PdfDict(metadata = metadata_object)
    pdf.Info.update(metadata)
    print(pdf.Info)

    sig = ''
    #根据pdf名读取其中内容至m中
    with open(pdfname, 'rb') as cert:
        content = cert.read()
        # content : bytes   m:list
        m = list(content)
        # print(m)
        #读取params
        params = setup()
        sig = sign(params,Bn(sk),m)
        
    #将sig写回pdf metadata域
    sigs.append(sig)
    metadata_object['signature'] = sigs
    metadata_new = PdfDict(metadata = metadata_object)
    pdf.Info.update(metadata_new)
    PdfWriter().write(pdfname, pdf)
        

