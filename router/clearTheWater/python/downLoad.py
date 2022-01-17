#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import requests
import re
import json
import sys
import getopt
from retrying import retry


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
            print('success')


def video_download(urlarg, fileName, musicarg):
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36 Edg/87.0.664.66'
    }
    download(urlarg, fileName, headers)


if __name__ == "__main__":
    inputUrl = sys.argv[1]

    fileName = sys.argv[2]

    # print('用户输入的url', inputUrl)
    video_download(inputUrl, fileName, 'yes')
