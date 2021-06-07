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

// 查询登录用户
router.post("/login", (req, res) => {
  var sql = $sql.query.login;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.username, parms.password], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  });
});

//  查询指定客户编号
router.post("/getCustomerId", (req, res) => {
  var sql = $sql.query.getCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    // conn.query(sql, this.$store.state.sql.querySearchPropertyArr, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(parms.customer_id);
      res.send(result);
    }
  });
});

// 获取客户列表
router.get("/getCustomer", (req, res) => {
  var sql = $sql.query.getCustomer;
  var parms = req.query;
  console.log(parms);
  conn.query(sql, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});
// 对客户id模糊查询
router.post("/getLocateCustomerId", (req, res) => {
  var sql = $sql.query.getLocateCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(parms.customer_id);

      res.send(result);
    }
  });
});

// 对客户所属公司模糊查询
router.post("/getLocateCompanyName", (req, res) => {
  var sql = $sql.query.getLocateCompanyName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.company_name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户编号获取 出库记录 信息
router.post("/getOutRecordByCustomerId", (req, res) => {
  var sql = $sql.query.getOutRecordByCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户所属公司获取 出库记录 信息
router.post("/getOutRecordByCompanyName", (req, res) => {
  var sql = $sql.query.getOutRecordByCompanyName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.company_name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户编号获取 箱子 信息
router.post("/getBoxByCustomerId", (req, res) => {
  var sql = $sql.query.getBoxByCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户所属公司获取 箱子 信息
router.post("/getBoxByCompanyName", (req, res) => {
  var sql = $sql.query.getBoxByCompanyName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.company_name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 获取所有 箱子 信息
router.post("/getAllBox", (req, res) => {
  var sql = $sql.query.getAllBox;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 获取所有 交易 信息
router.post("/getAllTrading", (req, res) => {
  var sql = $sql.query.getAllTrading;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 获取所有 出库记录 信息
router.post("/getAllOutRecord", (req, res) => {
  var sql = $sql.query.getAllOutRecord;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});
// 根据客户编号获取货物信息
router.post("/getProductByCustomerId", (req, res) => {
  var sql = $sql.query.getProductByCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户所属公司获取货物信息
router.post("/getProductByCompanyName", (req, res) => {
  var sql = $sql.query.getProductByCompanyName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.company_name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 获取所有货物信息
router.post("/getAllProduct", (req, res) => {
  var sql = $sql.query.getAllProduct;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 查询是否有相同的sku
router.post("/getSameSku", (req, res) => {
  var sql = $sql.query.getSameSku;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id, parms.product_name, parms.product_sku], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户id获取剩余金额信息
router.post("/getLeaveAmountByCustomerId", (req, res) => {
  var sql = $sql.query.getLeaveAmountByCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户所属公司获取剩余金额信息
router.post("/getLeaveAmountByCompanyName", (req, res) => {
  var sql = $sql.query.getLeaveAmountByCompanyName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.company_name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户id获取充值记录信息
router.post("/getRechargeByCustomerId", (req, res) => {
  var sql = $sql.query.getRechargeByCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户所属公司获取充值记录信息
router.post("/getRechargeByCompanyName", (req, res) => {
  var sql = $sql.query.getRechargeByCompanyName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.company_name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户id获取交易信息
router.post("/getTradingByCustomerId", (req, res) => {
  var sql = $sql.query.getTradingByCustomerId;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 根据客户所属公司获取交易信息
router.post("/getTradingByCompanyName", (req, res) => {
  var sql = $sql.query.getTradingByCompanyName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.company_name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

module.exports = router;
