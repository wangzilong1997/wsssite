var express = require('express')
var router = express.Router();

const querystring = require('querystring')

// 运行子程序
const cp = require('child_process')

// 虎牙五杀信息接口
router.get('/:url', (req, res) => {
  console.log('page接口', req.params)
  let { url } = req.params
  res.json({
    success: true,
    realUrl: 'hello world',
    url
  })
})

// 公用点赞接口
router.post('/realUrl', (req, res) => {
  console.log('抖音视频解析接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let { urlStr } = querystring.parse(str);
    let fileName = null;
    // 从传入数据中找到dy视频地址
    let mat = urlStr.match(/(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)
    if (mat) {
      urlStr = mat[0]
      fileName = mat[4] ? mat[4].replace(/\//g, '') : null
    }
    urlStr && fileName && cp.exec('python3 router/clearTheWater/python/getTKUrl.py ' + urlStr + ' ' + fileName, (err, stdout, stderr) => {
      if (err) console.log('stderr', err)
      if (stdout) {
        console.log('stdout', stdout)
        res.json({
          success: true,
          urlStr, stdout,
          fileName: 'https://www.guofudiyiqianduan.com/videos/' + fileName + '.mp4'
        })
      }
      if (stderr) console.log('stderr', stderr)
    });

    // 如果数据格式不正确
    if (!mat || !fileName) {
      res.json({
        success: false,
        urlStr: '',
        stdout: '请保证入参正确',
        fileName: ''
      })
    }
  })
})


module.exports = router;