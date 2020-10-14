'''
Populates the required pdf form templates: both for individual certificates and for the hash index.
'''
import os
import sys
import glob
import json
import datetime
import configargparse
import ipfshttpclient
from pdfrw import PdfReader, PdfWriter, PdfDict
from .chainpoint import ChainPointV2
from . import pdf_utils
from . import publish_hash
from . import cred_protocol
import ecies
from .email_helper import send_cert_email


'''
Inserts the ChainPointV2 proof as pdf metadata for each certificate. Metadata
key is "chainpoint_proof"
TODO: duplicate with issue_certificates
'''
def insert_proof_to_certificates(conf, cp, txid, cert_files, interactive=False):
    if interactive:
        print('')
    for ind, val in enumerate(cert_files):
        proof = json.dumps( cp.get_receipt(ind, txid) )
        metadata = PdfDict(chainpoint_proof=proof)
        pdf = PdfReader(val)
        pdf.Info.update(metadata)
        PdfWriter().write(val, pdf)
        if interactive:
            # print progress
            print('.', end="", flush=True)


'''
Creates a new ChainPointV2 object initializes with the certificates passed and
creates the corresponding merkle tree
TODO: duplicate with issue_certificates
'''
def prepare_chainpoint_tree(hashes):
    cp = ChainPointV2()
    cp.add_leaf(hashes)
    cp.make_tree()
    return cp


'''
Loads and returns the configuration options (either from --config or from
specifying the specific options.
'''
def load_config():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    default_config = os.path.join(base_dir, 'config.ini')
    p = configargparse.getArgumentParser(default_config_files=[default_config])
    p.add('-c', '--config', required=False, is_config_file=True, help='config file path')
    p.add_argument('-d', '--working_directory', type=str, default='.', help='the main working directory - all paths/files are relative to this')
    p.add_argument('-i', '--pdf_cert_template_file', type=str, default='cert_template.pdf', help='the pdf certificate form to populate')
    p.add_argument('-s', '--issuer', type=str, help='the name of the institution to (added in certificate metadata)')
    p.add_argument('-a', '--issuing_address', type=str, help='the issuing address with enough funds for the transaction; assumed to be imported in local node wallet')
    p.add_argument('-x', '--expiry_date', type=str, help='absolute expiry date up until the certificates will be valid')
    p.add_argument('-v', '--csv_file', type=str, default='graduates.csv', help='the csv file with the awardees\' data')
    p.add_argument('-e', '--certificates_directory', type=str, default='certificates', help='the directory where the new certificates will be copied')
    p.add_argument('-g', '--certificates_global_fields', type=str, default='', help='certificates global fields expressed as JSON string')
    #######
    p.add_argument('-b', '--cert_dids_csv_column', type=str, default='did', help='use this column from csv file for naming the certificates')
    p.add_argument('-f', '--cert_names_csv_column', type=str, default='name', help='use this column from csv file for naming the certificates')
    p.add_argument('-m', '--cert_metadata_columns', type=str, default='name,degree,grade', help='the specified columns from the csv or global fields will be included as json metadata')
    p.add_argument('-n', '--full_node_url', type=str, default='127.0.0.1:18332', help='the url of the full node to use')
    p.add_argument('-u', '--full_node_rpc_user', type=str, help='the rpc user as specified in the node\'s configuration')
    p.add_argument('-w', '--full_node_rpc_password', type=str, help='the rpc password as specified in the node\'s configuration')
    p.add_argument('-t', '--testnet', action='store_true', help='specify if testnet or mainnet will be used')
    p.add_argument('-f', '--tx_fee_per_byte', type=int, default=100, help='the fee per transaction byte in satoshis')
    p.add_argument('-p', '--issuer_identifier', type=str, default='        ', help='optional 8 bytes identifier that represents the issuer intented to go on the blockchain')
    p.add_argument('-r', '--verify_issuer', type=str, default='{ "methods": [] }',
                   help='Which verification methods to use to validate the issuer')
    args, _ = p.parse_known_args()
    return args


def create_certificates(conf, interactive=False):
    # check if issuance address has not been revoked!
    # TODO: REVOKE ADDRESS CMD


    pdf_utils.populate_pdf_certificates(conf, interactive)

    # get certificate file list here (to ensure it is identical to both
    # 'hash_certificates' and 'insert_proof_to_certificates'
    certificates_directory = os.path.join(conf.working_directory, conf.certificates_directory)
    cert_files = glob.glob(certificates_directory + os.path.sep + "*.pdf")

    cert_hashes = pdf_utils.hash_certificates(cert_files)
    cp = prepare_chainpoint_tree(cert_hashes)

    # create OP_RETURN in hex
    if conf.expiry_date:
        op_return_bstring = cred_protocol.issue_abs_expiry_cmd(conf.issuer_identifier,
                                                    cp.get_merkle_root(),
                                                    conf.expiry_date)
    else:
        op_return_bstring = cred_protocol.issue_cmd(conf.issuer_identifier,
                                                    cp.get_merkle_root())

    


    txid = publish_hash.issue_op_return(conf, op_return_bstring, interactive)
    insert_proof_to_certificates(conf, cp, txid, cert_files, interactive)
    print(txid)

    consent = input('Next step : encrypt and add to IPFS. Do you want to continue? [y/N]: ').lower() in ('y', 'yes')
    if not consent:
        sys.exit()

    #encrypt and add to IPFS
    client = ipfshttpclient.connect('/ip4/127.0.0.1/tcp/5001/http')
    for c in cert_files:
        csv_file = os.path.join(conf.working_directory, conf.csv_file)
        pdfdata = pdf_utils._process_csv(csv_file)
        for user in pdfdata:
            if user['did']+'.pdf' == os.path.basename(c):
                useremail = user['email']
                public_key = user['public_key']
                name = user['name']

                # encrypt file with public_key
                file_content = open(c, "rb").read()
                encrypted = ecies.encrypt(public_key, file_content)

                # upload encrypted file content to IPFS
                file_hash = client.add_bytes(encrypted)

                # print out uploaded file and hash
                print(os.path.basename(c), file_hash)

                # send the email with hash to user's mail
                try:
                    send_cert_email(useremail, name, file_hash)
                    print(f"{name}的邮件已发送到{useremail}")
                except Exception as e:
                    print(f"发送到{name}（{useremail}）的邮件失败。原因：{e}")



 
        # os.system('gpg --encrypt --recipient "'+useremail+'" '+c)
        # IPFS_res = client.add(c+'.gpg')['Hash']
        # print(os.path.basename(c),IPFS_res)
    client.close()

    return txid


def main():
    if sys.version_info.major < 3:
        sys.stderr.write('Python 3 is required!')
        sys.exit(1)



    conf = load_config()
    txid = create_certificates(conf, True)


    print('\nTx hash: {}'.format(txid))


if __name__ == "__main__":
    main()
