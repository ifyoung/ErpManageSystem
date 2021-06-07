// homeApi.js
var models = require("../db"); // 引入db配置
var express = require("express"); // express框架
var router = express.Router();
var mysql = require("mysql");
var $sql = require("../sqlMap"); // sql语句

// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

var jsonWrite = function(res, ret) {
  if (typeof ret === "undefined") {
    res.json({
      code: "1",
      msg: "操作失败",
    });
  } else {
    res.json(ret);
  }
};

// 更新保单信息
router.post("/updateProduct", (req, res) => {
  var sql = $sql.update.updateProduct;
  var parms = req.body;
  console.log(parms);
  conn.query(
    sql,
    [
      parms.come_time,
      parms.product_name,
      parms.product_sku,
      parms.storage_count,
      parms.save_days,
      parms.out_count,
      parms.status,
      parms.out_time,
      
      parms.customer_id,
      parms.product_code,
    ],
    function(err, result) {
      if (err) {
        console.log(err);
        // console.log(store.state.sql.sqlState)
        console.log("报错了天哪");
      }
      if (result) {
        console.log("成功上传了货品数据");

        jsonWrite(res, result);
      }
    }
  );
});
// 更新箱子信息
router.post("/updateBox", (req, res) => {
  var sql = $sql.update.updateBox;
  var parms = req.body;
  console.log(parms);
  conn.query(
    sql,
    [
      parms.come_time,
      parms.product_name,
      parms.length_width_height,
      parms.weight,
      parms.count,
      parms.out_count,
      parms.save_days,
      parms.status,
      parms.out_time,

      parms.customer_id,
      parms.box_code,

    ],
    function(err, result) {
      if (err) {
        console.log(err);
        // console.log(store.state.sql.sqlState)
        console.log("报错了天哪");
      }
      if (result) {
        console.log("成功上传");

        jsonWrite(res, result);
      }
    }
  );
});
// 更新保单信息
router.post("/updateTrading", (req, res) => {
  var sql = $sql.update.updateTrading;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.trading_date, parms.trading_content, parms.trading_amount, parms.status, parms.trading_code, parms.customer_id], function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
      // console.log(store.state.sql.sqlState)
      console.log("报错了天哪");
    }
    if (result) {
      console.log("成功上传");
      jsonWrite(res, result);
    }
  });
});

// 更新用户信息
router.post("/updateUser", (req, res) => {
  var sql = $sql.update.updateUser;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.password, parms.level, parms.username], function(err, result) {
    if (err) {
      console.log(err);
      // console.log(store.state.sql.sqlState)
      console.log("报错了天哪");
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

module.exports = router;
