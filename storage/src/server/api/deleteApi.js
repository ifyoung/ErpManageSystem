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

// 删除货物信息
router.post("/deleteProduct", (req, res) => {
  var sql = $sql.delete.deleteProduct;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.product_code], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

// 删除箱子信息
router.post("/deleteBox", (req, res) => {
  var sql = $sql.delete.deleteBox;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.box_code], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

// 删除客户信息
router.post("/deleteCustomer", (req, res) => {
  var sql = $sql.delete.deleteCustomer;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

// 删除交易记录信息
router.post("/deleteTrading", (req, res) => {
  var sql = $sql.delete.deleteTrading;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.trading_code], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

// 删除 出库记录 信息
router.post("/deleteOutRecord", (req, res) => {
  var sql = $sql.delete.deleteOutRecord;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.product_name, parms.product_sku, parms.out_time, parms.out_count], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

module.exports = router;
