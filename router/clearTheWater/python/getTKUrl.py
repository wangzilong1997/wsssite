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


@retry(stop_max_attempt_number=3)
def download(video_url, video_title, headers):
    # 视频下载
    if video_url == '':
        print('该视频可能无法下载哦~')
        return
    else:
        r = requests.get(url=video_url, headers=headers)
        if video_title == '':
            video_title = '此视频没有文案_'
        with open(f'public/videos/{video_title}.mp4', 'wb') as f:
            f.write(r.content)


def video_download(urlarg, fileName, musicarg):
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36 Edg/87.0.664.66'
    }
    r = requests.get(url=Find(urlarg)[0])
    key = re.findall('video/(\d+)?', str(r.url))[0]
    # 官方接口
    jx_url = f'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids={key}'
    # print('获取整个的js', jx_url)
    js = json.loads(requests.get(url=jx_url, headers=headers).text)
    # print('获取整个的js', js)
    try:
        video_url = str(js['item_list'][0]['video']['play_addr']
                        ['url_list'][0]).replace('playwm', 'play')  # 去水印后链接
    except:
        print('视频链接获取失败')
        video_url = ''
    try:
        music_url = str(js['item_list'][0]['music']['play_url']['url_list'][0])
    except:
        print('该音频目前不可用')
        music_url = ''
    try:
        video_title = str(js['item_list'][0]['desc'])
        music_title = str(js['item_list'][0]['music']['author'])
    except:
        print('标题获取失败')
        video_title = '视频走丢啦~'
    print(video_url)
    # download(video_url, fileName, headers)


if __name__ == "__main__":
    inputUrl = sys.argv[1]
    fileName = sys.argv[2]
    # print('用户输入的url', inputUrl)
    video_download(inputUrl, fileName, 'yes')
