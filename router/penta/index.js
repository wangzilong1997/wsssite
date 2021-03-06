const express = require("express");
const router = express.Router();
//相当于后台的路由，所有的后台处理都需要从这里经过

const huya = require("./components/huya");
const douyu = require("./components/douyu");
const common = require("./components/common")

router.use("/huya", huya);
router.use("/douyu", douyu);
router.use("/common", common);


module.exports = router;