const express = require('express')
const app = express()
const fs = require('fs')
const path = require("path")
var http = require('http');
var https = require('https')
var privatepem = fs.readFileSync('cert/guofudiyiqianduan.com.pem', 'utf8')
var privatekey = fs.readFileSync('cert/guofudiyiqianduan.com.key', 'utf8')
var credentials = { key: privatekey, cert: privatepem }
// 处理cookie中间件
var cookieParser = require('cookie-parser');



// 抖音视频处理相关路由
const clearTheWater = require('../router/clearTheWater/index')


// 用户相关路由
const users = require('../router/users')
// 五杀相关路由
const penta = require('../router/penta/index')
// 测试路由
const test = require('../router/test')

app.use(express.static(path.join(__dirname, '../public')));

// cookie过滤中间件
app.use(cookieParser("wangzilongzhendeshuai"))

// 用户相关路由
app.use('/users', users)

app.use('/clearTheWater', clearTheWater)

app.get('/4dbim/befast', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })

  fs.readFile(path.join(__dirname, '../befast/index.html'), 'utf-8', (err, data) => {
    if (err) {
      throw err
    }
    res.end(data)
  })

})

// 检查中间件过滤cookie 检查是否有权限访问业务接口
app.use((req, res, next) => {
  console.log('appuse login cookie', JSON.stringify(req.cookies), JSON.stringify(req.signedCookies), JSON.stringify(req.secret), req)
  if (req && req.cookies && req.cookies.username && (req.signedCookies.secret == req.cookies.username)) {
    next()
  } else {
    res.json({
      resule: "请先设置cookie",
      success: false
    })
  }
})


app.use('/penta', penta)

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



var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log("app监听80服务端口")
})
httpsServer.listen(443, () => {
  console.log('app监听443服务端口')
})