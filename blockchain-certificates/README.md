# Create/Revoke cli

# 需要改库代码

使用虚拟环境安装库的后，需要在`venv/lib`的库的代码中修改以下地方：

```python

# If ipfshttpclient==0.6.1, in its client/__init__.py, change the line 19 
VERSION_MAXIMUM   = "0.7.0"
# ... to
VERSION_MAXIMUM   = "0.8.0"


# Change in bitcoinutils/keys.py
# Skip the address validity check by return True directly
def  _is_address_valid():
    return True
```

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