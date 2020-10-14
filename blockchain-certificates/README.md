# Create/Revoke cli

Only tested under Linux.

```bash
# Create venv
virtualenv venv

# Get into venv
./venv/bin/activate

# Install packages
pip install -r requirements.txt

# 生成证书
python -m main.create_certificates -c example/config.ini

# 撤回证书
python -m main.revoke_certificates -c example/config.ini

# 验证证书
python -m main.validate_certificates -c example/config.ini

```