# -*- coding: utf-8 -*
import requests
import time
from lxml import etree
import datetime

import dbinsert

#check mima
def main():
    #dbinsert.insertpenta('五杀五杀', 'https://v.huya.com/play/499799441.html','卯月一', '2021-05-01 21:28')

    
    #dbinsert.undertime()
    getsubject()

def getsubject():
    page = 0;
    allpages = 500;

    for i in range(0,allpages):
        print("当前页面",allpages - page)


        get = requests.get(url='https://v.huya.com/g/vhuyawzry?set_id=3&order=new&page=' + str(allpages - page))
        get.encoding = 'utf-8'
        
        selector = etree.HTML(get.text)

        # 当前所访问页面的长度
        pagelength = selector.xpath("/html/body/article/section/div[2]/div/ul/li")
        lenpage = len(pagelength)
        print('pagelength',len(pagelength))
        # 提取信息
        findtext(selector,allpages - page,lenpage)

        page = page + 1

def findtext(selector,index,lenpage):


    item = 0;

    for i in range(0,lenpage):
        title = selector.xpath('/html/body/article/section/div[2]/div/ul/li['+ str(lenpage - item) +']/a/p/text()')
        if title == []:
            print("这个b标题为空")
            title.append("标题为空")
        print("项目"+ str(index) +" "+  str(lenpage - item))
        result = areyoupenta(title)

        print("是否五杀",result)
        href = selector.xpath('/html/body/article/section/div[2]/div/ul/li['+ str(lenpage - item) +']/a/@href')
        #注意此处虎牙img并非src而是data-original
        imgurl = selector.xpath('/html/body/article/section/div[2]/div/ul/li['+ str(lenpage - item) +']/a/div/img/@data-original')
        
        
        print("hrefhref",href)
        print("imgurlimgurl",imgurl)
        item = item + 1

        
        if(result):
            print("执行提取进一步五杀信息")
            new_titles = title[0]
            new_href = str("https://v.huya.com"+ href[0])

            getitem = requests.get(url="https://v.huya.com"+ href[0])
            getitem.encoding = 'utf-8'

            selectoritem = etree.HTML(getitem.text)

            itemtime = selectoritem.xpath('//*[@id="play2"]/div[2]/div[1]/div[2]/div[1]/div[1]/p[1]/span[2]/text()')
            author = selectoritem.xpath('//*[@id="play2"]/div[2]/div[1]/div[2]/div[1]/div[2]/a[1]/h3/text()')
            
            new_imgurl = "https:" + imgurl[0]
            print("imgurl",imgurl)

            print("new_titles",new_titles)
            print("author",author[0])
            print('itemtime',itemtime[0])
            print("new_href",new_href)

            #需判断时间是否插入
            if(comparetime(itemtime[0])):

                print("最新数据更新")
                dbinsert.insertpenta(new_titles,new_href,author[0],itemtime[0],new_imgurl)
            






    

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

    undertime = dbinsert.undertime()
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
    


if __name__ == '__main__':
    main()
    