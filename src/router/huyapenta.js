var express = require('express')
var router = express.Router();

const mysql = require("mysql")

const querystring = require('querystring')

const {setting} = require("../../conf/db")

// 虎牙五杀信息接口
router.get('/api/huyapenta/:page',(req,res)=>{
    console.log('setting',setting)
    let db = mysql.createConnection(setting)

    db.connect((err) => {
        if(err) throw err;
        console.log("链接成功")
    })
    

    let { page } = req.params

    console.log("page",page)
    console.log("list被访问")
    // let sql = '(select * from h y pen ta) union (select * from hyrelation) '
    let sql = 'select pentaid,author,imgurl,time,title,url,views,likes,unlikes from hypenta left outer join hyrelation on hyrelation.relationpentaid = hypenta.pentaid order by hypenta.pentaid desc limit '+ String(parseInt(page) *10 + 25) 
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
            res.json({
                result:result
            })
        }
    })
    db.end();
})

// 五杀视频访问数接口
router.post('/api/relation/view',(req,res)=>{
    console.log('/api/hyrelation访问')
    let str = ""
    req.on('data',function(data){
        str += data    //串联  data 数据
    });
    req.on('end',function(){
        str = decodeURI(str);
        let reqparams = querystring.parse(str);
        console.log(reqparams.pentaid);
        console.log(typeof reqparams)
        let db = mysql.createConnection(setting)

        db.connect((err) => {
            if(err) throw err;
            console.log("链接成功")
        })
        let sql = 'select views from hyrelation where relationpentaid = ' + reqparams.pentaid
        console.log('sql',sql)
        db.query(sql,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                console.log(result.length)
                if( result.length == 0 ) {
                    let addsql = 'insert into hyrelation (relationpentaid,views) values ('+ reqparams.pentaid + ',1)' 
                    console.log(addsql)
                    db.query(addsql,(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(result)
                            res.json({
                                success:true,
                                result:result
                            })
                        }
                    })
                    db.end()
                }else{
                    console.log('result.views',result)
                    let dataString = JSON.stringify(result);
                    let data = JSON.parse(dataString);
                    console.log('result.views',data)
                    let addviews = `update hyrelation set views = ${data[0].views + 1} where relationpentaid = ${reqparams.pentaid}` 
                    console.log(addviews)
                    db.query(addviews,(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(result)
                            res.json({
                                success:true,
                                result:result
                            })
                        }
                    })
                    db.end()
                }
                
                
            }
        })
	})
    
    
})

// 虎牙五杀点赞接口
router.post('/api/relation/like',(req,res) =>{
    console.log('虎牙点赞接口')
    let str = ""
    req.on('data', (data) => {
        str += data
    })
    req.on('end', () => {
        str = decodeURI(str);
        let reqparams = querystring.parse(str);
        console.log(reqparams.pentaid);
        console.log(typeof reqparams)
        let db = mysql.createConnection(setting)

        db.connect((err) => {
            if(err) throw err;
            console.log("链接成功")
        })
        let sql = 'select likes from hyrelation where relationpentaid = ' + reqparams.pentaid
        console.log('sql',sql)
        db.query(sql,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                console.log(result.length)
                if( result.length == 0 ) {
                    let addsql = 'insert into hyrelation (relationpentaid,likes) values ('+ reqparams.pentaid + ',1)' 
                    console.log(addsql)
                    db.query(addsql,(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(result)
                            res.json({
                                success:true,
                                result:result
                            })
                        }
                    })
                    db.end()
                }else{
                    console.log('result.views',result)
                    let dataString = JSON.stringify(result);
                    let data = JSON.parse(dataString);
                    console.log('result.views',data)
                    let addviews = `update hyrelation set likes = ${data[0].likes + 1} where relationpentaid = ${reqparams.pentaid}` 
                    console.log(addviews)
                    db.query(addviews,(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(result)
                            res.json({
                                success:true,
                                result:result
                            })
                        }
                    })
                    db.end()
                }
                
                
            }
        })
    })
})
// 虎牙五杀点踩接口
router.post('/api/relation/unlike',(req,res) =>{
    console.log('虎牙点赞接口')
    let str = ""
    req.on('data', (data) => {
        str += data
    })
    req.on('end', () => {
        str = decodeURI(str);
        let reqparams = querystring.parse(str);
        console.log(reqparams.pentaid);
        console.log(typeof reqparams)
        let db = mysql.createConnection(setting)

        db.connect((err) => {
            if(err) throw err;
            console.log("链接成功")
        })
        let sql = 'select unlikes from hyrelation where relationpentaid = ' + reqparams.pentaid
        console.log('sql',sql)
        db.query(sql,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                console.log(result.length)
                if( result.length == 0 ) {
                    let addsql = 'insert into hyrelation (relationpentaid,unlikes) values ('+ reqparams.pentaid + ',1)' 
                    console.log(addsql)
                    db.query(addsql,(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(result)
                            res.json({
                                success:true,
                                result:result
                            })
                        }
                    })
                    db.end()
                }else{
                    console.log('result.views',result)
                    let dataString = JSON.stringify(result);
                    let data = JSON.parse(dataString);
                    console.log('result.views',data)
                    let addviews = `update hyrelation set unlikes = ${data[0].unlikes + 1} where relationpentaid = ${reqparams.pentaid}` 
                    console.log(addviews)
                    db.query(addviews,(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(result)
                            res.json({
                                success:true,
                                result:result
                            })
                        }
                    })
                    db.end()
                }
                
                
            }
        })
    })
})

// toJSon
router.get('/api/backtoJson', (req, res) => {
  console.log(req)
  res.json({
    "BasicResponse": {
        "succeeded": 1
    },
    "RTDataSets": [
        {
            "kksCode": "BA2.BSH.LN_BSH_11_001_YC02",
            "type": 1,
            "RTDataValues": [
                {
                    "Value": 0,
                    "Time": 1632827562000
                },
                {
                    "Value": 0,
                    "Time": 1632826721000
                },
                {
                    "Value": 0,
                    "Time": 1632826661000
                },
                {
                    "Value": 0,
                    "Time": 1632826601000
                },
                {
                    "Value": 0,
                    "Time": 1632826541000
                },
                {
                    "Value": 0,
                    "Time": 1632826422000
                },
                {
                    "Value": 0,
                    "Time": 1632826421000
                },
                {
                    "Value": 0,
                    "Time": 1632826361000
                },
                {
                    "Value": 0,
                    "Time": 1632826301000
                },
                {
                    "Value": 0,
                    "Time": 1632826241000
                },
                {
                    "Value": 0,
                    "Time": 1632826181000
                },
                {
                    "Value": 0,
                    "Time": 1632826121000
                },
                {
                    "Value": 0,
                    "Time": 1632826075000
                },
                {
                    "Value": 0,
                    "Time": 1632826001000
                }
            ]
        }
    ]
  })
})
router.post('/api/backtoJson', (req, res) => {
  console.log(req)
  res.json({
    "BasicResponse": {
        "succeeded": 1
    },
    "RTDataSets": [
        {
            "kksCode": "BA2.BSH.LN_BSH_11_001_YC02",
            "type": 1,
            "RTDataValues": [
                {
                    "Value": 0,
                    "Time": 1632827562000
                },
                {
                    "Value": 0,
                    "Time": 1632826721000
                },
                {
                    "Value": 0,
                    "Time": 1632826661000
                },
                {
                    "Value": 0,
                    "Time": 1632826601000
                },
                {
                    "Value": 0,
                    "Time": 1632826541000
                },
                {
                    "Value": 0,
                    "Time": 1632826422000
                },
                {
                    "Value": 0,
                    "Time": 1632826421000
                },
                {
                    "Value": 0,
                    "Time": 1632826361000
                },
                {
                    "Value": 0,
                    "Time": 1632826301000
                },
                {
                    "Value": 0,
                    "Time": 1632826241000
                },
                {
                    "Value": 0,
                    "Time": 1632826181000
                },
                {
                    "Value": 0,
                    "Time": 1632826121000
                },
                {
                    "Value": 0,
                    "Time": 1632826075000
                },
                {
                    "Value": 0,
                    "Time": 1632826001000
                }
            ]
        }
    ]
  })
})

module.exports = router;