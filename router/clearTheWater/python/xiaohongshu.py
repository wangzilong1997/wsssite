import requests
import os
import time
from bs4 import BeautifulSoup  # 导入bs4库

'''https://ci.xiaohongshu.com/ 这个是小红书无水印拼接链接，后面只要传入：traceId 里面的参数即可'''

'''解析小红书链接的内容'''


def parsing_link(url):
    headers = {
        'authority': 'www.xiaohongshu.com',
        'method': 'GET',
        'path': '/discovery/item/607ee644000000000102f4ae?xhsshare=CopyLink&appuid=5d104649000000001003b205&apptime=1623338168',
        'scheme': 'https',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9 ',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'cache-control': 'no-cache',
        'cookie': 'xhsTrackerId=4f73ff7b-3a89-4d2c-cd9b-f2d4138a566a; extra_exp_ids=recommend_comment_hide_exp1,recommend_comment_hide_v2_clt,recommend_comment_hide_v3_clt,supervision_exp,supervision_v2_exp,commentshow_exp1,gif_exp1,ques_clt2; xhsTracker=url=noteDetail&xhsshare=CopyLink; timestamp2=1653914159997475c3a20d081c9e6b642a5319ec04a7870c0037e9cb4086424; timestamp2.sig=GGhd842idNnh9Fx8KgU1RZyeVfmHr7dcYtAcco-wX7I',
        'pragma': 'no-cache',
        'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 UBrowser/6.2.4098.3 Safari/537.36',
    }

    r = requests.get(url, headers=headers).text
    traceId = eval(r[r.find('imageList')+11:r.find(',"cover"')])
    print('traceId', traceId)
    url_list = [
        'https://ci.xiaohongshu.com/ci.xiaohongshu.com/8e23f184-50f8-597f-c797-3ddd58838e03?imageView2/2/w/1080/format/jpg']
    # for i in traceId:
    #     urls = f"https://ci.xiaohongshu.com/{i['traceId']}"
    #     url_list.append(urls)
    print('url_list', url_list)
    return url_list


'''url短链解析'''


def duanlianjie(original_link):
    url = 'https://duanwangzhihuanyuan.bmcx.com/web_system/bmcx_com_www/system/file/duanwangzhihuanyuan/get/'
    data = {
        "turl": original_link
    }
    res = requests.post(url, data=data).text
    soup = BeautifulSoup(res, 'lxml')  # html.parser是解析器，也可是lxml
    print(soup.prettify())  # 输出soup对象的内容
    print(soup.a['href'])
    return soup.a['href']


'''下载图片'''


def download(path, picture_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36        (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36 QIHU 360SE",
    }
    # for i in range(len(picture_url)):
    #     r = requests.get(picture_url, headers=headers)
    #     with open(fr'{filename}\{filename}{i}.jpg', 'wb') as f:
    #         f.write(r.content)
    start = time.time()
    for i in range(len(picture_url)):
        with open(f'{path}{i}.jpg', 'wb') as v:
            try:
                v.write(requests.get(
                    url=picture_url[i], headers=headers).content)
                end = time.time()
                cost = end - start
                print(f'{path} ===>downloaded ===>cost {cost}s')
            except Exception as e:
                print('视频下载错误！')


if __name__ == '__main__':
    original_link = input('请输入从小红书复制的链接：')
    # NewNordic发布了一篇小红书笔记，快来看吧！&#128518; 3nHwpvIq5U9hLtv &#128518; http://xhslink.com/aMtISc，复制本条信息，打开【小红书】App查看精彩内容！
    a = original_link[original_link.find('http'):original_link.find('，复制本条信息')]
    filename = input('请输入图片保存名称：')
    '''根据用户输入的名称，在代码根目录下创建对应文件夹'''
    Path = filename
    if os.path.exists(path=Path) == False:
        os.mkdir(path=Path)
    else:
        print('目录不存在！')
    os.chdir(path=Path)
    '''对用户输入的短链接，进行解析，改为长链接'''
    a = duanlianjie(original_link)
    '''解析链接中的无水印链接'''
    url_list = parsing_link(a)
    '''下载无水印图片'''
    download(filename, url_list)
