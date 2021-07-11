# -*- coding: utf-8 -*
import requests
import time
from lxml import etree
import datetime
import sys

import re

import dbinsert


table = 'dypenta'

#check mima
def main():
    #dbinsert.insertpenta('五杀五杀', 'https://v.huya.com/play/499799441.html','卯月一', '2021-05-01 21:28')

    
    #dbinsert.undertime()
    getsubject()

def getsubject():
    page = 0;
    allpages = 50;

    for i in range(0,allpages):
        print("当前页面",allpages - page)


        get = requests.get(url='https://v.douyu.com/directory/catelist/49?action=new&page=' + str(allpages - page))
        get.encoding = 'utf-8'
        
        selector = etree.HTML(get.text)

        # 当前所访问页面的长度
        # pagelength = selector.xpath("//*[@id='J-list']")
        # lenpage = len(pagelength)
        # print(pagelength)
        # print('pagelength',len(pagelength))
        # # 提取信息
        findtext(selector,allpages - page,30)

        page = page + 1

def findtext(selector,index,lenpage):


    item = 0;

    for i in range(0,lenpage):

        title = selector.xpath('//*[@id="J-list"]/a['+  str(lenpage - item) +']/@title')
        if title == []:
            print("这个b标题为空")
            title.append("标题为空")
        # print("项目"+ str(index) +" "+  str(lenpage - item))
        
        result = areyoupenta(title)

        # print("是否五杀",result)
        # href = selector.xpath('/html/body/article/section/div[2]/div/ul/li['+ str(lenpage - item) +']/a/@href')
        href = selector.xpath('//*[@id="J-list"]/a['+  str(lenpage - item) +']/@href')
        #注意此处虎牙img并非src而是data-original
        imgurl = selector.xpath('//*[@id="J-list"]/a[' + str(lenpage - item) + ']/span[1]/em/img/@src')
        author = selector.xpath('//*[@id="J-list"]/a[' + str(lenpage - item) + ']/span[2]/span/span[1]/strong/text()')

        # print("title",title)
        # print("author",author)
        # print("hrefhref",href)
        # print("imgurlimgurl",imgurl)
        item = item + 1

        
        if(result):
            print("执行提取进一步五杀信息")
            new_titles = title[0]
            new_imgurl = imgurl[0]
            # new_href = str(href[0])
            

            # getitem = requests.get(url=new_href)
            # getitem.encoding = 'utf-8'

            # selectoritem = etree.HTML(getitem.text)

            # itemtime = selectoritem.xpath('/html/body/demand-video-app/main/div[1]/demand-video-title/div/div[2]/span[3]')
            
            # author = selectoritem.xpath('/html/body/demand-video-app/main/div[2]/demand-video-anchor//div/div/div/div/a[1]/@title')
        
            #有的图片链接自带https:
            # if(imgurl[0][0:6] == "https:" ):
            #     print("ulr https:执行")
            #     new_imgurl = imgurl[0]
            # else:
            #     new_imgurl = "https:" + imgurl[0]
            #     print("ulr https:执行")
            
            new_href = href[0][25:]
            # new_href = href[0]
            new_author = author[0]
            # print("imgurl",imgurl)

            # print("new_titles",new_titles)
            # print("author",author)
            # print('itemtime',itemtime)
            # print("new_href",new_href)
            print('五杀进行执行')
 
           
            
 

            if(comparehref(new_href)):

                print("数据库中无 且 最新数据更新")
                # 需判断时间是否插入
                dbinsert.insertpenta(new_titles,new_href,new_author,'2020-01-01 16:35:00',new_imgurl,table)
            






    

#判断是否是五杀
def areyoupenta(title):
    print(title)
    ispenta = '5杀' in str(title)
    fivepenta = '五杀' in str(title)
    result = 'True' in (str(ispenta) + str(fivepenta))

    return result

#用户上传时间判断长短
def comparetime(ctime):
    print(ctime)

    undertime = dbinsert.undertime(table)
    #人工添加残缺秒的部分
    tss2 = str(ctime)+ ':00'
    print('undertime',undertime)
    print('tss2',tss2)
    timeArray2 = time.strptime(tss2, "%Y-%m-%d %H:%M:%S")
  
    print('timeArray2',timeArray2)
    timestamp2 = int(time.mktime(timeArray2))
    print('timestamp2',timestamp2)

    print("undertime",undertime)
    print("timestamp2",timestamp2)
    
    if(undertime >= timestamp2):
        return False
    else :
        return True

def comparehref(href):
    print("comparehref",href)
    notinhere = dbinsert.notinhere(table,href)
    print("notinhere",notinhere)

    return notinhere

if __name__ == '__main__':
    main()
    