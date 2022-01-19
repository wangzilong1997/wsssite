const { exec } = require('../../../db/mysql')

const saveFileinDb = (filename = "default", url = "default", type = "default", filetype = "default", info = "default") => {
  let sql = `insert into resource (filename,url,type,filetype,info) values ('${filename}','${url}','${type}','${filetype}','${info}')`
  return exec(sql)
}
const fileExistinDb = (url = 'default') => {
  let sql = `SELECT * from resource where url = '${url}'`
  return exec(sql)
}
module.exports = {
  saveFileinDb,
  fileExistinDb
}