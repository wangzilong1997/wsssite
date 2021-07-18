const express = require('express')

const app = express()

const mysql = require("mysql")

const {setting} = require("./setting")

let url = require('url')
let fs = require('fs')
let path = require("path")


app.use( express.static(path.join(__dirname, '../show')));


app.get('/huyapenta/:page',(req,res)=>{
    console.log('setting',setting)
    const db = mysql.createConnection(setting)

    db.connect((err) => {
        if(err) throw err;
        console.log("链接成功")
    })
    

    let { page } = req.params

    console.log("page",page)
    console.log("list被访问")
    let sql = 'select * from penta order by pentaid desc limit '+ String(parseInt(page) *10 + 25)
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
            res.json({
                result:result
            })
        }
    })
    db.end();
})

app.get('/index',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'})

    fs.readFile(path.join(__dirname,'../show/index.html'),'utf-8',(err,data)=>{
        if (err) {
            throw err
        }
        res.end(data)
    })

})

app.get('/indexReact',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'})

    fs.readFile(path.join(__dirname,'../show/indexReact.html'),'utf-8',(err,data)=>{
        if (err) {
            throw err
        }
        res.end(data)
    })

})

app.listen(80,()=>{
    console.log("app监听80服务端口")
})