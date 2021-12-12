
// const { MYSQL_CONF } = require("../../../conf/db")
const { exec } = require('../../../db/mysql')

const pageS = (page, type = 'hy', userid = 666) => {
  let sql = `select hy.pentaid,hy.author,hy.imgurl,hy.time,hy.title,hy.url,a.views,a.likes,a.unlikes,l.likes as ilike,l.unlikes as iunlike,l.userid,l.type
  from ${type}penta hy
  left outer join ${type}relation a
  on a.relationpentaid = hy.pentaid
  left outer join allpentalike l
  on l.pentaid = hy.pentaid and l.userid =  ${userid}
  WHERE l.type='${type}' or l.type is NULL
  order by hy.pentaid desc limit `
    + String(parseInt(page) * 10 + 25)
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
      let addviews = `update ${pentaType}relation set ${like} = ${(likes + (likesval == 1 ? 1 : -1)) > 0 ? (likes + (likesval == 1 ? 1 : -1)) : 0} where relationpentaid = ${pentaid}`
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


      // 数据是否有变化
      let seletSql = `SELECT * from allpentalike WHERE pentaid = ${pentaid} and userid = ${userid} and type = '${type}' and ${likes} = ${likesval}`
      let updSql = `UPDATE allpentalike SET ${likes} = ${likesval} WHERE pentaid = ${pentaid} and userid = ${userid} and type = '${type}'`
      return exec(seletSql).then(result => {
        if (result.length == 0) {
          return exec(updSql).then(result => {
            return Promise.resolve('可以进行插入操作')
          })
        } else {
          return Promise.reject('存在相同数据')
        }
      })
    } else {
      return Promise.reject('错误的数据')
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