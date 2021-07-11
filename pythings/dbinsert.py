# -*- coding: utf-8 -*
from os import truncate
from pymysql import *
import json
import time 
import datetime
from pymysql.converters import escape_string
#引入配置文件
import configparser
from setting import host,port,database,user,password,charset

from string import Template


def insertpenta(titile,url,author,timeinhere,imgurl,table):
    
 
    template1 = Template('insert into $table(title, url, author, time,imgurl) values(%s, %s, %s, %s, %s)')
    
    conn = connect(host=host, port=port, database=database, user=user,
                   password=password, charset=charset)
    

    cs1 = conn.cursor()
    print("链接开始")


    query = template1.substitute(table=table)
    
    values = (titile,url,author,timeinhere,imgurl)

    cs1.execute(query, values)


    conn.commit()

    cs1.close()

    conn.close()
    print("链接结束")

def undertime(table):
    template1 = Template('select time from $table where pentaid = (select max(pentaid) from $table)')
    conn = connect(host=host, port=port, database=database, user=user,
                   password=password, charset=charset)
    cs2 = conn.cursor()

    query = template1.substitute(table=table)

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

def notinhere(table,myherf):
    print('notinherenotinherenotinhere')
    print(typeof(table))
    print(typeof(myherf))
    print(myherf)
    templateherf = Template("select pentaid from dypenta where url = $myherf")
    print(templateherf)
    conn = connect(host=host, port=port, database=database, user=user,
                   password=password, charset=charset)
    cs2 = conn.cursor()

    query = templateherf.substitute(table = table,myherf = myherf)
    print(query)
    sql_update = "SELECT pentaid FROM dypenta  WHERE url = '{}' ;".format(myherf)
    cs2.execute(sql_update)

    json=fetch_dict_result(cs2)
    # print('cs2',cs2.fetchall())
    # print('cs2length',len(cs2.fetchall()))
    print(json)
    print('jsonlength',len(json))
    conn.commit()

    cs2.close()

    conn.close()
    if len(json) == 2:
        print('可以进行插入')
        return True
    else:
        print('已经存有数据')
        return False
 
def fetch_dict_result(cur):
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
            json_data.append(dict(zip(row_headers,result)))
    return json.dumps(json_data)

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


 