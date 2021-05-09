const express = require('express')

const app = express()

const mysql = require("mysql")

const {setting} = require("./setting")

const schedule = require('node-schedule')

const cp = require('child_process')
const { stderr } = require('process')

const cphuyapenta = () =>{
	//每天每小时执行
	schedule.scheduleJob('30 [0,30] * * * *',()=>{
		cp.exec('python3 pythings/penta.py',(err,stdout,stderr)=>{
            if (err) {
                console.log('stderr',err)
            }
            if (stdout) {
                console.log('stdout',stdout)
            }
        })
		console.log('schedule执行：'+ new Date());
	});
}
cphuyapenta()


console.log('setting',setting)
const db = mysql.createConnection(setting)

db.connect((err) => {
    if(err) throw err;
    console.log("链接成功")
})



app.get('/huyapenta',(req,res)=>{
    console.log("list被访问")
    let sql = 'select * from penta order by pentaid desc limit 10'
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
})

app.listen(8080,()=>{
    console.log("app监听8080服务端口")
})