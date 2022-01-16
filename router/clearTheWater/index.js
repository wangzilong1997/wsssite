const express = require("express");
const router = express.Router();
//相当于后台的路由，所有的后台处理都需要从这里经过

const getTKUrl = require("./components/getTKUrl")

router.use("/getTKUrl", getTKUrl);


module.exports = router;