const mysql = require('mysql')

const  { MYSQL_CONF }  = require('../conf/db')



// 执行统一执行语句
const exec = (sql) => {
  // 缺少数据库连接池的处理
  // con.connect((err) => {
  //   if(err) throw err;
  //   console.log("链接成功")
  // })
  
  // console.log(MYSQL_CONF)
  const promise = new Promise((resolve, reject) => {
    // 创建链接对象
    const con = mysql.createConnection(MYSQL_CONF)
    con.connect((err) => {
      if(err) throw err;
      console.log("链接成功")
    })
    
    con.query(sql, (err, result) => {
        console.log(sql,err,result)
        if (err) {
            reject(err)
            return
        }
        resolve(result)
        con.end();
    })

})
return promise
}

module.exports = { 
  exec
}