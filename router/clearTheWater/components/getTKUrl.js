var express = require('express')
var router = express.Router();
const querystring = require('querystring')

const { saveFileinDb, fileExistinDb } = require('./service')

// 运行子程序
const cp = require('child_process')

// 获取真实路径接口
router.post('/realUrl', (req, res) => {
  let str = ""
  req.on('data', (data) => {
    str += data
  })
  req.on('end', () => {
    str = decodeURI(str);
    let { urlStr } = querystring.parse(str);
    let fileName = null;
    // 从传入数据中找到dy视频地址
    let mat = urlStr && urlStr.match(/(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)
    console.log(mat)
    // 获取到是哪个平台
    let platform = urlStr && urlStr.match(/\w+(?=\.com)/)[0]
    console.log(platform)

    if (mat) {
      urlStr = mat[0]
      fileName = mat[4] ? mat[4].replace(/\//g, '') : null
    }
    console.log('python3 router/clearTheWater/python/' + platform + '.py ' + urlStr)
    urlStr && cp.exec('python3 router/clearTheWater/python/' + platform + '.py ' + urlStr, (err, stdout, stderr) => {
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
    str = decodeURI(str.replace(/%/g, '%25'));
    let { downLoadUrl, fileName, info } = querystring.parse(str);
    // 下载路径视频到服务器
    // 如何给前端信号已经下载好了呢？？ 重新建立接口
    cp.exec('python3 router/clearTheWater/python/downLoad.py ' + '"' + downLoadUrl + '" ' + fileName, (err, stdout, stderr) => {
      if (err) console.log('err', err)
      if (stdout) {
        res.json({
          success: true,
          stdout, downLoadUrl,
          fileName: 'https://www.guofudiyiqianduan.com/videos/' + fileName + '.mp4'
        })
        // 如果数据库中存在该地址 则不新增
        fileExistinDb('https://www.guofudiyiqianduan.com/videos/' + fileName + '.mp4').then(result => {
          if (result.length == 0) {
            // 存入数据库
            saveFileinDb(fileName, 'https://www.guofudiyiqianduan.com/videos/' + fileName + '.mp4', 'douyin', 'mp4', info)
          }
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