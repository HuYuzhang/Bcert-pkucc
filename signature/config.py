import configargparse

default_config = 'config.ini'

# 统一的读取配置的方法
def load_config():
    p = configargparse.getArgumentParser(default_config_files=[default_config])
    p.add('-c', '--config', required=False, is_config_file=True, help='config file path')
    p.add_argument('-w', '--certificates_directory', type=str, default='.', help='the certificates directory - all certificates are stored here')
    p.add_argument('-k', '--secret_key', type=str, default='.', help='the secret key used in signing ')
    p.add_argument('-o', '--origin_directory', type=str, default='.', help='the directory for origin certificates')
    p.add_argument('-w', '--all_certificates_directory', type=str, default='.', help='the directories for signed certificates to be aggregated')
    p.add_argument('-a', '--aggr_output_directory', type=str, default=".", help="The directory for the pdfs with aggregated signatures")
    p.add_argument('-v', '--verify_directory', type=str, default='.', help='the main working directory - all paths/files are relative to this')
    p.add_argument('-d', '--working_directory', type=str, default='.', help='the main working directory - all paths/files are relative to this')
    p.add_argument('-n', '--signer_num', type=int, default=3, help='the number of all the signers')
    p.add_argument('-t', '--valid_num', type=int, default=2,help='the number of the needed signer to form a valid signature')
    p.add_argument('-s', '--signer', type=str, help='the information of all the signers')
    args, _ = p.parse_known_args()
    return args