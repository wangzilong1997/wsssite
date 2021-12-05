var express = require('express')
var router = express.Router();

const querystring = require('querystring')

const { MYSQL_CONF } = require("../../../conf/db")

const { exec } = require('../../../db/mysql')

// 斗鱼五杀信息接口
router.get('/:page', (req, res) => {
  let { page } = req.params

  let sql = 'select pentaid,author,imgurl,time,title,url,views,likes,unlikes from dypenta left outer join dyrelation on dyrelation.relationpentaid = dypenta.pentaid order by dypenta.pentaid desc limit ' + String(parseInt(page) * 10 + 25)
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
  console.log('/api/dyrelation访问')
  let str = ""
  req.on('data', function (data) {
    str += data    //串联  data 数据
  });
  req.on('end', function () {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);

    let sql = 'select views from dyrelation where relationpentaid = ' + reqparams.pentaid
    exec(sql).then(result => {
      if (result.length == 0) {
        let addsql = 'insert into dyrelation (relationpentaid,views) values (' + reqparams.pentaid + ',1)'
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
        let addviews = `update dyrelation set views = ${+data[0].views + 1} where relationpentaid = ${reqparams.pentaid}`
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

// 斗鱼五杀点赞接口
router.post('/like', (req, res) => {
  console.log('虎牙点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);
    let sql = 'select likes from dyrelation where relationpentaid = ' + reqparams.pentaid
    exec(sql).then(result => {
      if (result.length == 0) {
        let addsql = 'insert into dyrelation (relationpentaid,likes) values (' + reqparams.pentaid + ',1)'
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
        let addviews = `update dyrelation set likes = ${likes + 1} where relationpentaid = ${reqparams.pentaid}`
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
// 斗鱼五杀点踩接口
router.post('/unlike', (req, res) => {
  console.log('虎牙点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let reqparams = querystring.parse(str);
    let sql = 'select unlikes from dyrelation where relationpentaid = ' + reqparams.pentaid
    exec(sql).then(result => {
      if (result.length == 0) {
        let addsql = 'insert into dyrelation (relationpentaid,unlikes) values (' + reqparams.pentaid + ',1)'
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
        let addviews = `update dyrelation set unlikes = ${+data[0].unlikes + 1} where relationpentaid = ${reqparams.pentaid}`
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