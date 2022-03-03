'''
Author: 王子龙
Date: 2022-03-02 17:37:06
LastEditTime: 2022-03-02 17:45:41
LastEditors: 王子龙
Descripttion: 
'''
from bs4 import BeautifulSoup
from selenium import webdriver

url = "http://legendas.tv/busca/walking%20dead%20s03e02"
browser = webdriver.PhantomJS()
browser.get(url)
html = browser.page_source
soup = BeautifulSoup(html, 'lxml')
a = soup.find('section', 'wrapper')
