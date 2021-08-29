const express = require('express')

const app = express()

const mysql = require("mysql")

const {setting} = require("./setting")
const querystring = require('querystring');
let url = require('url')
let fs = require('fs')
let path = require("path")
const huyapenta = require('./router/huyapenta')

app.use( express.static(path.join(__dirname, '../show')));


// hy信息get查询
app.use('/',huyapenta)

app.get('/index',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'})

    fs.readFile(path.join(__dirname,'../show/index.html'),'utf-8',(err,data)=>{
        if (err) {
            throw err
        }
        res.end(data)
    })

})


app.listen(80,()=>{
    console.log("app监听80服务端口")
})