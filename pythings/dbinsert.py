# -*- coding: utf-8 -*
from pymysql import *
import json
import time 
import datetime

#引入配置文件
import configparser
from setting import host,port,database,user,password,charset





def insertpenta(titile,url,author,timeinhere,imgurl):
    
 

    conn = connect(host=host, port=port, database=database, user=user,
                   password=password, charset=charset)
    

    cs1 = conn.cursor()
    print("链接开始")


    query = 'insert into penta(title, url, author, time,imgurl) values(%s, %s, %s, %s, %s)'
    
    values = (titile,url,author,timeinhere,imgurl)

    cs1.execute(query, values)


    conn.commit()

    cs1.close()

    conn.close()
    print("链接结束")

def undertime():
    conn = connect(host=host, port=port, database=database, user=user,
                   password=password, charset=charset)
    cs2 = conn.cursor()

    query = 'select time from penta where pentaid = (select max(pentaid) from penta)'

    cs2.execute(query)
    print(cs2)

    endtime = cs2.fetchone()[0]
    print(typeof(cs2.fetchall()))


    print(endtime)
    print(typeof(endtime))

    tss1 = str(endtime)

    timeArray = time.strptime(tss1, "%Y-%m-%d %H:%M:%S")

    #转化为时间戳
    timestamp = int(time.mktime(timeArray))

    print(timestamp)

    conn.commit()

    cs2.close()

    conn.close()

    return timestamp
    #判断变量类型的函数
def typeof(variate):
    type=None
    if isinstance(variate,int):
        type = "int"
    elif isinstance(variate,str):
        type = "str"
    elif isinstance(variate,float):
        type = "float"
    elif isinstance(variate,list):
        type = "list"
    elif isinstance(variate,tuple):
        type = "tuple"
    elif isinstance(variate,dict):
        type = "dict"
    elif isinstance(variate,set):
        type = "set"
    return type


 