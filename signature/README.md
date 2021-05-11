1. 建了一个config.py文件，读取配置都是调用这个文件的load_config方法读取
2. 所有PDF文件啥的都放在本目录下的`examples/`下，其中certificates是原文件，certificates1/2/3是分别签了的文件，aggregated是带有合并后的签名的文件
3. 配置项里所有绝对路径都改成了相对路径，默认cwd是当前目录
4. 配置项里加了一个`aggr_output_directory`，用来存放带有合并后签名的PDF文件
5. `origin_directory`之前为什么有三个路径？改成了一个
6. `verify_signature`也是从`aggr_output_directory`和`origin_directory`读取文件

```python
# the directory of the origin copy of certificates
# origin_directory = examples/certificates1,examples/certificates2,examples/certificates
origin_directory = examples/certificates

# the directory where the pdf with aggregated signature is saved
aggr_output_directory = examples/aggregated
```

现在这套走了`sign_certificates.py`、`aggregate_signature.py`和`verify_signature.py`，最后是可以正常验证的。


# 运行方法

使用`pipenv`来管理项目的依赖，这样其他的机器都可以通过以下方法安装需要依赖的pip包。

`pipenv`没有把包装在项目根目录，也不用担心git commit把那些安装的包也commit上来。

`.gitignore`把`example`目录给ignore了，这样测试用的文件也不会提交到git上去。

```bash
# 安装pipenv，一个管理python虚拟环境的
pip install pipenv

# 安装这个项目的pip依赖包
pipenv install

# 进入虚拟环境
pipenv shell

# 正常运行python命令
python verify_signature.py
```