const express = require('express')
const app = express()
const fs = require('fs')
const path = require("path")

var https = require('https')
var privatepem = fs.readFileSync('cert/guofudiyiqianduan.com.pem', 'utf8')
var privatekey = fs.readFileSync('cert/guofudiyiqianduan.com.key', 'utf8')
var credentials = { key: privatekey, cert: privatepem }
// 处理cookie中间件
var cookieParser = require('cookie-parser');



// 用户相关路由
const users = require('../router/users')

// huyapenta路由
const huyapenta = require('../router/huyapenta')
// douyupenta路由
const douyupenta = require('../router/huyapenta')
const test = require('../router/test')

app.use(express.static(path.join(__dirname, '../public')));

// cookie过滤中间件
app.use(cookieParser("wangzilongzhendeshuai"))

// 用户相关路由
app.use('/users', users)

// 检查中间件过滤cookie 检查是否有权限访问业务接口
app.use((req, res, next) => {
  console.log('appuse login cookie', JSON.stringify(req.cookies), JSON.stringify(req.signedCookies), JSON.stringify(req.secret))
  if (req && req.cookies && req.cookies.username && req.secret == "wangzilongzhendeshuai") {
    next()
  } else {
    res.json({
      resule: "请先设置cookie",
      success: false
    })
  }
})

// hy信息get查询
app.use('/', huyapenta)
// douyu信息get查询
// app.use('/',douyupenta)

// 测试路由
app.use('/test', test)



app.get('/index', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })

  fs.readFile(path.join(__dirname, '../public/index.html'), 'utf-8', (err, data) => {
    if (err) {
      throw err
    }
    res.end(data)
  })

})


app.listen(80, () => {
  console.log("app监听80服务端口")
})

https.createServer(credentials, app).listen(443)