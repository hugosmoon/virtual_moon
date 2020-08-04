# -*- coding: utf-8 -*-
# flake8: noqa

from qiniu import Auth, put_file, etag
import qiniu.config
import os
import time
import requests

#需要填写你的 Access Key 和 Secret Key
access_key = 'VfUZy5Gm-aQkbLkpm_lcTraFLW9ac9h1wj-SHbbr'
secret_key = 'hBwXWe0BBbkkntfGRUtSEmsA1M9uZqrESiWyIzzk'

#构建鉴权对象
q = Auth(access_key, secret_key)

#要上传的空间
bucket_name = 'hugosmodel'

# #上传后保存的文件名
# key = str(round(time.time()*1000000)) + '.png'

# # policy={
# #  'callbackUrl':'http://hugosmodel.diandijiaoyu.com.cn/callback.php',
# #  'callbackBody':'filename=$(fname)&filesize=$(fsize)'
# #  }

# #生成上传 Token，可以指定过期时间等
# token = q.upload_token(bucket_name, key, 3600)
# # token = q.upload_token(bucket_name, key, 3600, policy)

# #要上传文件的本地路径

# localfile = os.getcwd()+'/vmm/static/images/cdjd.png'

# ret, info = put_file(token, key, localfile)
# print(info.text_body)
# assert ret['key'] == key
# assert ret['hash'] == etag(localfile)
# # print(os.getcwd())

base_url = 'http://hugosmodel.diandijiaoyu.com.cn/1595825433540880.STL'
private_url = q.private_download_url(base_url, expires=360)
print(private_url)