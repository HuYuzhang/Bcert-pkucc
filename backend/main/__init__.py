from flask import render_template
from flask import request
from blockcert.validate_certificates import validate_certificate,get_issuer_address,get_issuer_verification
from blockcert import network_utils
import json
from flask_cors import *
from app import app
from PyPDF2 import PdfFileReader
from pprint import pprint
import pathlib



# create upload path
upload_path = "upload"
pathlib.Path(upload_path).mkdir(exist_ok=True)

api_root = "bcert.pku.edu.cn"

btcd_url = f"https://jasmin3q:123456@{api_root}:18334"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@cross_origin()
def index(path):
    return render_template('index.html')

# 没连接上btcd，所以先去掉了……
conf = {
    'blockchain_services': { "services": [ { "blockcypher":{} } ], "required_successes": 1 },
    #'blockchain_services': { "services": [ { "blockcypher":{} }, { "btcd": { "full_url": btcd_url }} ], "required_successes": 2 },
    'config':'PKU_2020_Graduates/config.ini', 
    'full_node_rpc_password':'123456', 
    'full_node_rpc_user':'jasmin3q',
    'issuer_identifier':'UNicDC',
    'testnet':True,
}

@app.route('/upload',methods=['post'])
@cross_origin()
def upload():

    try:
       certname = request.files['file'].filename
       cert = request.files.get('file')
       url = upload_path + "/" + certname
       cert.save(url)
       valid, reason = validate_certificate(url, conf['issuer_identifier'],conf['testnet'],conf['blockchain_services'])
    except:
       return render_template('uploadfail.html',state='认证失败！',reason='请检查您是否上传了正确的文件或联系网站管理人员。')
    else:
       if valid:
           file = open(url, 'rb')
           fileReader = PdfFileReader(file)
           textfields =fileReader.getFormTextFields()
           info = fileReader.getDocumentInfo()
           #print(info)
           pdfname = info['/metadata'].find('name')
           pdfmajor = info['/metadata'].find('major')
           pdfdate = info['/metadata'].find('date')

           issuer_address = get_issuer_address(url)
           verify_issuer = get_issuer_verification(url)
           # if valid then check issuer verification methods
           issuer_verification = None
           if verify_issuer:
                issuer_verification = network_utils.check_issuer_verification_methods(issuer_address,verify_issuer, conf['testnet'])
           time=info['/metadata'][pdfdate+78 : pdfdate+82]+'年'
           name=info['/metadata'][pdfname+70 : pdfmajor-5].encode('utf-8').decode('unicode_escape')
           #print(name.encode('utf-8').decode('unicode_escape'))
           #print(json.dumps(name).decode("unicode-escape"))
           major=info['/metadata'][pdfmajor+64 : pdfdate-5].encode('utf-8').decode('unicode_escape')

           issuer = verify_issuer[0]['did']['blockstack']
           if issuer=='pku_edu.id' and issuer_verification['did']['success']==True:
               issuer_state="验证通过，为北大官方id与地址"
           else:
               issuer_state="验证失败"
           #reason = '证书持有者为北京大学'+info['/metadata'][date+78 : date+82]+'届毕业生'+info['/metadata'][name+70 : major-5]+'。'
           return render_template('uploadsuccess.html',state='该证书为真',time=time, name = name,major=major,issuer=issuer,issuerstate=issuer_state )
       else:
           if reason.find('revoked')!= -1:
               reason = '原因：该证书已被撤回，不再具有有效性。'
           return render_template('uploadfail.html',state='该证书为假！',reason = reason)



#return send_file('modules/passport/1.csv',mimetype='text/csv',attachment_filename='Adjacency.csv',as_attachment=True)

@app.route('/verify', methods=['get','post'])
@cross_origin()
def verify():
    print("verify")
    url = request.values.get('url') #获取参数
    cert = url
    #cert='/home/jasmine/blockchain-certificates/PKU_2020_Graduates/certificates/Alice.pdf'
    try:
       valid, reason = validate_certificate(cert, conf['issuer_identifier'],conf['testnet'],conf['blockchain_services'])
    except:
       return '认证失败！url错误或服务器异常'
    else:    
      if valid:
       file = open(url, 'rb')
       fileReader = PdfFileReader(file)
       textfields =fileReader.getFormTextFields()
       #dest = fileReader.getNamedDestinations()
       #page = fileReader.getPage(0)
       info = fileReader.getDocumentInfo()
       name = info['/metadata'].find('name')
       major = info['/metadata'].find('major')
       date = info['/metadata'].find('date')
       print(info['/metadata'][name+70 : major-5])
       print(info['/metadata'][major+64 : date-5])
       print(info['/metadata'][date+78 : date+82])
       return '该证书为真！'+'持有者为北京大学'+info['/metadata'][date+78 : date+82]+'届毕业生'+info['/metadata'][name+70 : major-5]+'。'
      else:
       return '该证书为假！'+'原因:'+reason

@app.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin']='*'
    environ.headers['Access-Control-Allow-Method']='*'
    environ.headers['Access-Control-Allow-Headers']='x-requested-with,content-type'
    return environ


