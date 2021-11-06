const express = require('express')
const app = express()
const fs = require('fs')
const path = require("path")

// huyapenta路由
const huyapenta = require('../router/huyapenta')
const test = require('../router/test')

app.use( express.static(path.join(__dirname, '../public')));


// hy信息get查询
app.use('/',huyapenta)

// 测试路由
app.use('/test',test)

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