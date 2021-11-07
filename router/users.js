var express = require('express')
var router = express.Router();

const querystring = require('querystring')

const {MYSQL_CONF} = require("../conf/db")

const { exec } = require('../db/mysql')

router.post('/api/user/register',(req,res) => {
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
      if(result.length === 0){
        let addsql = "insert into users (name,password) values ('"+ reqparams.name+  "','" +reqparams.password +"')"
        exec(addsql).then(result => {
          res.json({
            success:true,
            result:result
          })
        })
      }else{
        res.json({
          success:false,
          result:'用户已经存在'
        })
      }
    })
    

  })

})
router.post('/api/user/login',(req,res) => {
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
      if( result.length == 0 ) {
        res.json({
          success:false,
          result:"用户不存在"
        })
      }else{
        console.log('hello',result[0])
        if(result[0].password == reqparams.password){
          // 设置 session
          req.session = {name:result[0].name}
          res.json({
            success:true,
            result:"登陆成功"
          })
        }
      }
    })
    

  })

})

module.exports = router;