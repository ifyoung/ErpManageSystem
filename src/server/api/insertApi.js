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

// 插入客户信息
router.post("/insertCustomer", (req, res) => {
  var sql = $sql.insert.insertCustomer;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.company_name, parms.first_come_time, parms.leave_amount], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

// 插入货品信息
router.post("/insertProduct", (req, res) => {
  var sql = $sql.insert.insertProduct;
  var parms = req.body;
  console.log(parms);
  conn.query(
    sql,
    [
      parms.customer_id,
      parms.come_time,
      parms.product_name,
      parms.product_sku,
      parms.storage_count,
      parms.save_days,
      parms.out_count,
      parms.status,
      parms.product_code,
      parms.out_time,
    ],
    function(err, result) {
      // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        jsonWrite(res, result);
      }
    }
  );
});

// 插入交易信息
router.post("/insertTrading", (req, res) => {
  var sql = $sql.insert.insertTrading;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.trading_date, parms.trading_content, parms.trading_amount, parms.status, parms.trading_code], function(
    err,
    result
  ) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
      // jsonWrite(res, result);
    }
  });
});
// 插入箱子信息
router.post("/insertBox", (req, res) => {
  var sql = $sql.insert.insertBox;
  var parms = req.body;
  console.log(parms);
  conn.query(
    sql,
    [
      parms.customer_id,
      parms.come_time,
      parms.product_name,
      parms.length_width_height,
      parms.weight,
      parms.count,
      parms.save_days,
      parms.out_count,
      parms.status,
      parms.box_code,
      parms.real_weight,
      parms.out_time,
    ],
    function(err, result) {
      // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.send(result);
        // jsonWrite(res, result);
      }
    }
  );
});

// 插入 出库记录 信息
router.post("/insertOutRecord", (req, res) => {
  var sql = $sql.insert.insertOutRecord;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.product_name, parms.product_sku, parms.out_time, parms.out_count], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
      // jsonWrite(res, result);
    }
  });
});
module.exports = router;
