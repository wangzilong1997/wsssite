const express = require('express')
const app = express()
const fs = require('fs')
const path = require("path")

// 处理cookie中间件
var cookieParser = require('cookie-parser');


// huyapenta路由
const huyapenta = require('../router/huyapenta')
// douyupenta路由
const douyupenta = require('../router/huyapenta')
const test = require('../router/test')

// 用户相关路由
const users = require('../router/users')
app.use( express.static(path.join(__dirname, '../public')));

// cookie过滤中间件
app.use(cookieParser())

// hy信息get查询
app.use('/',huyapenta)
// douyu信息get查询
// app.use('/',douyupenta)

// 测试路由
app.use('/test',test)

// 用户相关路由
app.use('/users',users)

app.get('/index',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'})

    fs.readFile(path.join(__dirname,'../public/index.html'),'utf-8',(err,data)=>{
        if (err) {
            throw err
        }
        res.end(data)
    })

})


app.listen(80,()=>{
    console.log("app监听80服务端口")
})