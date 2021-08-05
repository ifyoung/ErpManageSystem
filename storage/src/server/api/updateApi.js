var express = require("express"); // express框架
var router = express.Router();
var $sql = require("../sqlMap"); // sql语句
var conn = require("../conn") // 引用封装的mysql.js


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

// 更新指定客户信息
router.post("/updateSpecificCustomer", (req, res) => {
  var sql = $sql.update.updateSpecificCustomer;
  var parms = req.body;
  console.log(parms);
  conn.query(
    sql,
    [
      parms.customer_id,
      parms.company_name,
      parms.first_come_time,
      parms.leave_amount,
      parms.auto_pwd,
      parms.customer_id,
  
    ],
    function(err, result) {
      if (err) {
        console.log(err);
        // console.log(store.state.sql.sqlState)
        console.log("报错了天哪");
      }
      if (result) {
        jsonWrite(res, result);
      }
    }
  );
});

// 更新货品信息
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
      parms.record_code,

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
      parms.record_code,

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

// 更新箱子信息
router.post("/updateOutRecordWithBox", (req, res) => {
  var sql = $sql.update.updateOutRecordWithBox;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.status,parms.customer_id, parms.product_name, parms.out_count, parms.product_sku,parms.out_time,parms.record_code], function(err, result) {
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


// 更新货物信息
router.post("/updateOutRecordWithProduct", (req, res) => {
  var sql = $sql.update.updateOutRecordWithProduct;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.status,parms.customer_id, parms.product_name, parms.out_count, parms.product_sku,parms.record_code], function(err, result) {
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
module.e
module.exports = router;
