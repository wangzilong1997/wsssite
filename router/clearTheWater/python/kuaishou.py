#!/usr/bin/env python
# -*- encoding: utf-8 -*-
'''
@Description:懒得优化这一块
@Date       :2020/12/28 13:14:29
@Author     :JohnserfSeed
@version    :1.0
@License    :(C)Copyright 2017-2020, Liugroup-NLPR-CASIA
@Mail       :johnserfseed@gmail.com
'''
from email import header
import requests
import re
import json
import sys
import getopt
from retrying import retry


def Find(string):
    # findall() 查找匹配正则表达式的字符串
    url = re.findall(
        'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', string)
    return url


def video_download(urlarg):
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36 Edg/87.0.664.66'
    }
    r = requests.get(url=Find(urlarg)[0], headers=headers)
    html = r.text
    # print(html)
    try:
        key = re.findall(
            r"(?<=\"srcNoMark\":\"https://)(.*?)(?=.mp4)", html)[0]
    except:
        return
    # print(key)
    url = "https://" + key + ".mp4"
    print(url)


if __name__ == "__main__":
    inputUrl = sys.argv[1]
    # print('用户输入的url', inputUrl)
    video_download(inputUrl)
