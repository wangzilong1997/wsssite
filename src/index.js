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



// 水印视频处理相关路由
const clearTheWater = require('../router/clearTheWater/index')

// 用户相关路由
const users = require('../router/users')
// 五杀相关路由
const penta = require('../router/penta/index')
// 测试路由
const test = require('../router/test')


// 设置静态资源路径
app.use(express.static(path.join(__dirname, '../public')));

// 日志相关中间件
/*/   日志相关    */
var logger = require('morgan');

var FileStreamRotator = require('file-stream-rotator');
var logDirectory = path.join(__dirname, '../public/logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})

app.use(logger('combined', { stream: accessLogStream }));//写入日志文件

var util = require('util')

var logPath = path.join(__dirname, '../public/logs/console.log')
var logFile = fs.createWriteStream(logPath, { flags: 'a' })
// 从新定义console 并且记录输出
console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n')
  process.stdout.write(util.format.apply(null, arguments) + '\n')
}
console.error = function () {
  logFile.write(util.format.apply(null, arguments) + '\n')
  process.stderr.write(util.format.apply(null, arguments) + '\n')
}
/*   日志相关    /*/

// cookie过滤中间件
app.use(cookieParser("wangzilongzhendeshuai"))

// 用户相关路由
app.use('/users', users)

// 清除水印相关接口
app.use('/clearTheWater', clearTheWater)

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


// 猪妖五杀相关路由接口
app.use('/penta', penta)

// 测试路由
app.use('/test', test)

// index页面返回资源接口
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })

  fs.readFile(path.join(__dirname, '../public/pages/index.html'), 'utf-8', (err, data) => {
    if (err) {
      throw err
    }
    res.end(data)
  })

})

// http服务开启
var httpServer = http.createServer(app);
// https服务开启
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log("app监听80服务端口")
})
httpsServer.listen(443, () => {
  console.log('app监听443服务端口')
})