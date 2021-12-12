var express = require('express')
var router = express.Router();

const querystring = require('querystring')

// 引入的 service
const { pageS, viewS, viewLogS, like, likeLogS } = require('./service')

// 虎牙五杀信息接口
router.get('/:page/:type/:userid', (req, res) => {
  console.log('page接口', req.params)
  let { page, type, userid } = req.params
  pageS(page, type, userid).then(result => {
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
      viewS(type, userid, pentaid, views).then((result) => {
        res.json(result)
      })
    })

    // res.json(viewS(reqparams.pentaid))
  })
})
// 公用点赞接口
router.post('/like', (req, res) => {
  console.log('公用点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let { type, userid, pentaid, likes, likesval } = querystring.parse(str);
    likeLogS(type, userid, pentaid, likes, likesval).then((result) => {
      like(pentaid, type, likes, likesval)
        .then(result => res.json(result))
        .catch(err => {
          res.json({ success: false, result: err })
        })
    })
      .catch(err => {
        res.json({ success: false, result: err })
      })

  })
})



module.exports = router;