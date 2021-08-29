var express = require('express')
var router = express.Router();

const mysql = require("mysql")

const {setting} = require("../../conf/db")

router.get('/huyapenta/:page',(req,res)=>{
    console.log('setting',setting)
    let db = mysql.createConnection(setting)

    db.connect((err) => {
        if(err) throw err;
        console.log("链接成功")
    })
    

    let { page } = req.params

    console.log("page",page)
    console.log("list被访问")
    // let sql = '(select * from penta) union (select * from hyrelation) '
    let sql = 'select pentaid,author,imgurl,time,title,url,views from penta left outer join hyrelation on hyrelation.relationpentaid = penta.pentaid order by penta.pentaid desc limit '+ String(parseInt(page) *10 + 25) 
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

router.post('/api/hyrelation',(req,res)=>{
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

module.exports = router;