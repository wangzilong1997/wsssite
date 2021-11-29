var express = require('express')
var router = express.Router();

const querystring = require('querystring')

const { MYSQL_CONF } = require("../conf/db")

const { exec } = require('../db/mysql')

// 获取一天以后的时间字符串 给cookie设定时间
// const getCookieExpires = () => {
//   const d = new Date()
//   d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
//   console.log('d.toGMTString() is ', d.toGMTString())
//   return d.toGMTString()
// }

router.post('/api/user/register', (req, res) => {
  console.log('虎牙点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);
    console.log(reqparams)

    let sql = "select * from users where name = '" + reqparams.name + "'"

    exec(sql).then(result => {
      if (result.length === 0) {
        let addsql = "insert into users (name,password) values ('" + reqparams.name + "','" + reqparams.password + "')"
        exec(addsql).then(result => {
          res.json({
            success: true,
            result: result
          })
        })
      } else {
        res.json({
          success: false,
          result: '用户已经存在'
        })
      }
    })


  })

})
router.post('/api/user/login', (req, res) => {
  console.log('虎牙点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);
    console.log(reqparams)

    let sql = "select * from users where name = '" + reqparams.name + "'"

    exec(sql).then(result => {
      if (result.length == 0) {
        res.json({
          success: false,
          result: "用户不存在"
        })
      } else {
        console.log('hello', result[0])
        if (result[0].password == reqparams.password) {
          // 设置 cookie 设置登陆用户
          res.cookie("username", result[0].name, {
            httpOnly: true, // 只允许后端修改
            expires: false,
            maxAge: 5 * 60 * 1000,
            path: '/'
          });
          res.json({
            success: true,
            result: "登陆成功"
          })
        }
      }
    })


  })

})
router.post('/api/user/logout', (req, res) => {
  console.log('虎牙点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);
    console.log(reqparams)

    res.clearCookie('username')
    res.json({
      success: true,
      result: req.cookies.username
    })
  })

})

module.exports = router;