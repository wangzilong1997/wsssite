var express = require('express')
var router = express.Router();

const mysql = require("mysql")

const querystring = require('querystring')

// const {setting} = require("../conf/db")
const { exec } = require('../db/mysql')

// 虎牙五杀信息接口
// router.get('/:page',(req,res)=>{
//   console.log('setting',setting)
//   let db = mysql.createConnection(setting)

//   db.connect((err) => {
//       if(err) throw err;
//       console.log("链接成功")
//   })
  

//   let { page } = req.params

//   console.log("page",page)
//   console.log("list被访问")
//   // let sql = '(select * from h y pen ta) union (select * from hyrelation) '
//   let sql = 'select pentaid,author,imgurl,time,title,url,views,likes,unlikes from hypenta left outer join hyrelation on hyrelation.relationpentaid = hypenta.pentaid order by hypenta.pentaid desc limit '+ String(parseInt(page) *10 + 25) 
//   db.query(sql,(err,result)=>{
//       if(err){
//           console.log(err)
//       }else{
//           console.log(result)
//           res.json({
//               result:result
//           })
//       }
//   })
//   db.end();
// })
// 虎牙五杀信息接口
router.get('/2/:page',(req,res)=>{
  let { page } = req.params
  // let sql = '(select * from h y pen ta) union (select * from hyrelation) '
  let sql = 'select pentaid,author,imgurl,time,title,url,views,likes,unlikes from hypenta left outer join hyrelation on hyrelation.relationpentaid = hypenta.pentaid order by hypenta.pentaid desc limit '+ String(parseInt(page) *10 + 25) 
  exec(sql).then((result)=>{
      res.json({
        result:result
      })
  }).catch((error) =>{
    console.log("error: " + error.message);
  });
})

module.exports = router;