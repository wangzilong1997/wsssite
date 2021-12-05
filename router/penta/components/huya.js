var express = require('express')
var router = express.Router();

const querystring = require('querystring')

const { MYSQL_CONF } = require("../../../conf/db")

const { exec } = require('../../../db/mysql')

// 虎牙五杀信息接口
router.get('/:page', (req, res) => {
  let { page } = req.params

  let sql = 'select pentaid,author,imgurl,time,title,url,views,likes,unlikes from hypenta left outer join hyrelation on hyrelation.relationpentaid = hypenta.pentaid order by hypenta.pentaid desc limit ' + String(parseInt(page) * 10 + 25)
  exec(sql).then(result => {
    res.json({
      result: result
    })
  }).catch(e => {
    console.log(e)
  })
})
// 五杀视频访问数接口
router.post('/view', (req, res) => {
  console.log('/api/hyrelation访问')
  let str = ""
  req.on('data', function (data) {
    str += data    //串联  data 数据
  });
  req.on('end', function () {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);

    let sql = 'select views from hyrelation where relationpentaid = ' + reqparams.pentaid
    exec(sql).then(result => {
      if (result.length == 0) {
        let addsql = 'insert into hyrelation (relationpentaid,views) values (' + reqparams.pentaid + ',1)'
        exec(addsql).then(result => {
          res.json({
            success: true,
            result: result
          })
        })
      } else {
        console.log('result.views', result)
        let dataString = JSON.stringify(result);
        let data = JSON.parse(dataString);
        console.log('result.views', data)
        let addviews = `update hyrelation set views = ${+data[0].views + 1} where relationpentaid = ${reqparams.pentaid}`
        console.log(addviews)
        exec(addviews).then(result => {
          res.json({
            success: true,
            result: result
          })
        })
      }
    })
  })
})

// 虎牙五杀点赞接口
router.post('/like', (req, res) => {
  console.log('虎牙点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);
    let sql = 'select likes from hyrelation where relationpentaid = ' + reqparams.pentaid
    exec(sql).then(result => {
      if (result.length == 0) {
        let addsql = 'insert into hyrelation (relationpentaid,likes) values (' + reqparams.pentaid + ',1)'
        exec(addsql).then(result => {
          res.json({
            success: true,
            result: result
          })
        })
      } else {
        console.log('result.views', result)
        let dataString = JSON.stringify(result);
        let data = JSON.parse(dataString);
        let likes = +data[0].likes
        console.log('likes', typeof likes)
        console.log('result.views', data)
        let addviews = `update hyrelation set likes = ${likes + 1} where relationpentaid = ${reqparams.pentaid}`
        console.log(addviews)
        exec(addviews).then(result => {
          res.json({
            success: true,
            result: result
          })
        })
      }
    })
  })
})
// 虎牙五杀点踩接口
router.post('/unlike', (req, res) => {
  console.log('虎牙点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);
    let sql = 'select unlikes from hyrelation where relationpentaid = ' + reqparams.pentaid
    exec(sql).then(result => {
      if (result.length == 0) {
        let addsql = 'insert into hyrelation (relationpentaid,unlikes) values (' + reqparams.pentaid + ',1)'
        console.log(addsql)
        exec(addsql).then(result => {
          res.json({
            success: true,
            result: result
          })
        })
      } else {
        console.log('result.views', result)
        let dataString = JSON.stringify(result);
        let data = JSON.parse(dataString);
        console.log('result.views', data)
        let addviews = `update hyrelation set unlikes = ${+data[0].unlikes + 1} where relationpentaid = ${reqparams.pentaid}`
        console.log(addviews)
        exec(addviews).then(result => {
          res.json({
            success: true,
            result: result
          })
        })
      }
    })
  })
})

module.exports = router;