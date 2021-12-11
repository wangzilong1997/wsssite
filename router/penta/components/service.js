
// const { MYSQL_CONF } = require("../../../conf/db")
const { exec } = require('../../../db/mysql')

const pageS = (page, type = 'hy') => {
  let sql = 'select pentaid,author,imgurl,time,title,url,views,likes,unlikes from hypenta left outer join hyrelation on hyrelation.relationpentaid = hypenta.pentaid order by hypenta.pentaid desc limit ' + String(parseInt(page) * 10 + 25)
  return exec(sql)
}

const viewS = (type = 'hy', userid = 0, pentaid = 0, views = 0) => {
  let sql = `select views from ${type}relation where relationpentaid = ${pentaid}`
  return exec(sql).then(result => {
    if (result.length == 0) {
      let addsql = `insert into ${type}relation (relationpentaid,views) values (${pentaid} ,1)`
      return exec(addsql).then(result => {
        return {
          success: true,
          result: result
        }
        // return result
      })
    } else {
      console.log('result.views', result)
      let dataString = JSON.stringify(result);
      let data = JSON.parse(dataString);
      console.log('result.views', data)
      let addviews = `update ${type}relation set views = ${+data[0].views + 1} where relationpentaid = ${pentaid}`
      console.log(addviews)
      return exec(addviews).then(result => {
        return {
          success: true,
          result: result
        }
        // return result
      })
    }
  })
}

const viewLogS = (type = 'test', userid = 0, pentaid = 0, views = 0) => {
  let sql = `INSERT into allpentaview (type,userid,pentaid,views,createTime) VALUES ('${type}',${userid},${pentaid},${views},NOW())`
  return exec(sql)
}

const like = (pentaid, type = "hy", like = 'likes', likesval = 1) => {
  let pentaType = type
  let sql = `select ${like} from ${pentaType}relation where relationpentaid = ` + pentaid
  return exec(sql).then(result => {
    if (result.length == 0) {
      let addsql = `insert into ${pentaType}relation (relationpentaid,${like}) values (` + pentaid + ',1)'
      return exec(addsql).then(result => {
        return {
          success: true,
          result: result
        }
      })
    } else {
      console.log('result.views', result)
      let dataString = JSON.stringify(result);
      let data = JSON.parse(dataString);
      let likes = +data[0][like]
      console.log('likes', typeof likes)
      console.log('result.views', data)
      let addviews = `update ${pentaType}relation set ${like} = ${likes + (likesval == 1 ? 1 : -1)} where relationpentaid = ${pentaid}`
      console.log(addviews)
      return exec(addviews).then(result => {
        return {
          success: true,
          result: result
        }
      })
    }
  })
}

const likeLogS = (type = "hy", userid = 0, pentaid = 0, likes = 'likes', likesval = 999) => {
  let sql = `SELECT * from allpentalike WHERE pentaid = ${pentaid} and userid = ${userid} and type = '${type}'`
  return exec(sql).then((result) => {
    console.log('likelogs resule', result)
    let insSql = `INSERT into allpentalike (type,userid,pentaid,${likes},createTime) VALUES ('${type}',${userid},${pentaid},${likesval},NOW())`
    if (result.length == 0) {
      return exec(insSql)
    } else if (result.length == 1) {
      let updSql = `UPDATE allpentalike SET ${likes} = ${likesval} WHERE pentaid = ${pentaid} and userid = ${userid} and type = '${type}'`
      return exec(updSql)
    } else {
      return new Promise.reject('错误的数据')
    }
  })
}

module.exports = {
  pageS,
  viewS,
  viewLogS,
  like,
  likeLogS
}