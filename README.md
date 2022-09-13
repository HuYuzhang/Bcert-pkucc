# 发布证书

准备工作
```
# 启动比特币客户端：
# using qt
bitcoin-qt
# using bitcoin-cli
bitcoind -testnet daemon
bitcoin-cli stop

# 启动IPFS客户端：
ipfs daemon
```

生成发布证书：
```
source new_py3_env/bin/activate
cd blockchain-certificates
create-certificates -c PKU_2023_Graduates/config.ini
```


# 验证证书

准备工作
```
# 启动btcd
cd gopath/bin
./btcd
# 启动blockstack
blockstack api start
```

验证证书：
```
validate-certificates -c PKU_2022_Graduates/config.ini -f /home/jasmine/blockchain-certificates/PKU_2022_Graduates/certificates/123wyz.id.blockstack.pdf
```

# 撤回证书

准备工作：
```
# 停止btcd启动比特币：
bitcoin-qt
```

撤回证书
```
# 撤回单个证书：
revoke-certificates -c PKU_2021_Graduates/config.ini -p /home/jasmine/blockchain-certificates/PKU_2021_Graduates/certificates/dys1997.id.blockstack.pdf
# 撤回一组交易：
revoke-certificates -c PKU_2020_Graduates/config.ini -b 4b8f6b08e9cb38c7954798e355d769e804801a6604cb41433286d84bcba887d4
# 撤回颁发地址：
revoke-certificates -c PKU_2021_Graduates/config.ini -s
```

# 启动前端

启动IPFS、btcd、blockstack
```
source new_py3_env/bin/activate
cd backend
# 运行flask
python blockcert.py
# 运行react.js：
cd webserver/frontend
npm start
```




