const mysql = require('mysql')

const  { MYSQL_CONF }  = require('../conf/db')

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 执行统一执行语句
const exec = (sql) => {
  // console.log(MYSQL_CONF)
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
        console.log(sql,err,result)
        if (err) {
            reject(err)
            return
        }
        resolve(result)
    })
})
return promise
}

module.exports = { 
  exec
}