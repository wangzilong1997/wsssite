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
  console.log('公用点赞接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let { urlStr } = querystring.parse(str);
    let mat = urlStr.match(/(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)
    console.log(mat[4].replace(/\//g, ''))
    urlStr = mat ? mat[0] : null
    let fileName = mat[4] ? mat[4].replace(/\//g, '') : null

    urlStr && cp.exec('python3 router/clearTheWater/python/getTKUrl.py ' + urlStr + ' ' + fileName, (err, stdout, stderr) => {
      if (err) console.log('stderr', err)
      if (stdout) {
        console.log('stdout', stdout)
        res.json({
          success: true,
          urlStr, stdout,
          fileName: 'https://www.guofudiyiqianduan.com/videos/' + fileName + '.mp4'
        })
        // cp.exec('python3 router/clearTheWater/python/getTKUrl.py ' + stdout, (err, stdout, stderr) => {
        //   if (err) console.log('stderr', err)
        //   if (stdout) {
        //     console.log('stdout', stdout)
        //   }
        //   if (stderr) console.log('stderr', stderr)
        // })

      }
      if (stderr) console.log('stderr', stderr)
    });
  })
})


module.exports = router;