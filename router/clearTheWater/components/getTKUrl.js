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

// 获取真实路径接口
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
      if (err) console.log('err', err)
      if (stdout) {
        // 解析成功先返回链接给前端
        console.log('stdout', stdout)
        stdout = stdout.replace('\n', '')
        res.json({
          success: true,
          urlStr, stdout,
          fileName: fileName
        })
        // 下载路径视频到服务器
        // 如何给前端信号已经下载好了呢？？ 待解决
        // cp.exec('python3 router/clearTheWater/python/downLoad.py ' + '"' + stdout + '"' + ' ' + fileName, (err, stdout, stderr) => {
        //   if (err) console.log('err', err)
        //   if (stdout) {

        //     console.log('stdout', stdout)
        //   }
        //   if (stderr) console.log('stderr', stderr)
        // })
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

// 下载文件到服务器接口
router.post('/downLoadTK', (req, res) => {
  console.log('抖音视频解析接口')
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let { downLoadUrl, fileName } = querystring.parse(str);
    // 下载路径视频到服务器
    // 如何给前端信号已经下载好了呢？？ 重新建立接口
    cp.exec('python3 router/clearTheWater/python/downLoad.py ' + '"' + downLoadUrl + '"' + ' ' + fileName, (err, stdout, stderr) => {
      if (err) console.log('err', err)
      if (stdout) {
        res.json({
          success: true,
          stdout, downLoadUrl,
          fileName: 'https://www.guofudiyiqianduan.com/videos/' + fileName + '.mp4'
        })
        console.log('stdout', stdout)
      }
      if (stderr) console.log('stderr', stderr)
      // 如果数据格式不正确
      if (!stdout || !fileName) {
        res.json({
          success: false,
          urlStr: '',
          stdout: '请保证入参正确',
          fileName: ''
        })
      }
    })

  })
})



module.exports = router;