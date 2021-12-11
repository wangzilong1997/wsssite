var express = require('express')
var router = express.Router();

const querystring = require('querystring')

// 引入的 service
const { pageS, viewS, viewLogS, like, likeLogS } = require('./service')

// 虎牙五杀信息接口
router.get('/:page', (req, res) => {
  let { page } = req.params
  pageS(page).then(result => {
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
    let { type, userid, pentaid, views } = querystring.parse(str);
    console.log('views 接口访问', type, userid, pentaid, views)
    viewLogS(type, userid, pentaid, views).then(result => {
      console.log('views接口访问2', result)
      viewS(pentaid).then((result) => {
        res.json(result)
      })
    })

    // res.json(viewS(reqparams.pentaid))
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
    let { type, userid, pentaid, likes } = querystring.parse(str);
    likeLogS(type, userid, pentaid, likes == 'likes' ? 1 : 0).then((result) => {
      like(pentaid, type, likes).then(result => res.json(result))
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
    let { type, userid, pentaid, likes } = querystring.parse(str);
    likeLogS(type, userid, pentaid, likes == 'likes' ? 1 : 0).then((result) => {
      like(pentaid, type, likes).then(result => res.json(result))
    })
  })
})

module.exports = router;