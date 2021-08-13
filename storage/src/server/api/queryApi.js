var express = require("express"); // express框架
var router = express.Router();
var $sql = require("../sqlMap"); // sql语句
var conn = require("../conn"); // 引用封装的mysql.js

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

// 查询登录管理员
router.post("/loginInUser", (req, res) => {
  var sql = $sql.query.loginInUser;
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

// 查询登录客户
router.post("/loginInCustomer", (req, res) => {
  var sql = $sql.query.loginInCustomer;
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

// (时间排序)根据客户编号获取 箱子 信息
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

// (时间排序)根据客户所属公司获取 箱子 信息
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

// (名称排序)根据客户编号获取 箱子 信息
router.post("/getBoxByCustomerIdByName", (req, res) => {
  var sql = $sql.query.getBoxByCustomerIdByName;
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

// (名称排序)根据客户所属公司获取 箱子 信息
router.post("/getBoxByCompanyNameByName", (req, res) => {
  var sql = $sql.query.getBoxByCompanyNameByName;
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

// (公司名称排序)获取所有 交易 信息
router.post("/getTradingLocate", (req, res) => {
  var sql = $sql.query.getTradingLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
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
// (时间排序)根据客户编号获取货物信息
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

// (时间排序)根据客户所属公司获取货物信息
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

// (名称排序)根据客户编号获取货物信息
router.post("/getProductByCustomerIdByName", (req, res) => {
  var sql = $sql.query.getProductByCustomerIdByName;
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

// (名称排序)根据客户所属公司获取货物信息
router.post("/getProductByCompanyNameByName", (req, res) => {
  var sql = $sql.query.getProductByCompanyNameByName;
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

// 查询是否有相同的sku
router.post("/getSameSku", (req, res) => {
  var sql = $sql.query.getSameSku;
  var parms = req.body;
  console.log(parms);
  conn.query(
    sql,
    [parms.customer_id, parms.product_name, parms.product_sku],
    function(err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.send(result);
      }
    }
  );
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

// (公司名称排序)获取交易信息
router.post("/getTradingByName", (req, res) => {
  var sql = $sql.query.getTradingByName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 获取地址表信息，根据 记录码
router.post("/getAddress", (req, res) => {
  var sql = $sql.query.getAddress;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.record_code], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 获取客户id获取指定客户信息
router.post("/getSpecificCustomer", (req, res) => {
  var sql = $sql.query.getSpecificCustomer;
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

// (货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getProductLocate", (req, res) => {
  var sql = $sql.query.getProductLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (时间排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getProductLocateByTime", (req, res) => {
  var sql = $sql.query.getProductLocateByTime;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (已知客户编号)(时间排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getSingleProductLocateByTime", (req, res) => {
  var sql = $sql.query.getSingleProductLocateByTime;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info,parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (已知客户编号)(名称排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getSingleProductLocateByName", (req, res) => {
  var sql = $sql.query.getSingleProductLocateByName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info,parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (名称排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getProductLocateByName", (req, res) => {
  var sql = $sql.query.getProductLocateByName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getProductLocate", (req, res) => {
  var sql = $sql.query.getProductLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

  // (已知客户编号)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getSingleProductLocate", (req, res) => {
  var sql = $sql.query.getSingleProductLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info,parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});


// (货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getBoxLocate", (req, res) => {
  var sql = $sql.query.getBoxLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (时间排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getBoxLocateByTime", (req, res) => {
  var sql = $sql.query.getBoxLocateByTime;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (名称排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getBoxLocateByName", (req, res) => {
  var sql = $sql.query.getBoxLocateByName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});


// (已知客户编号)(箱子管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getSingleBoxLocate", (req, res) => {
  var sql = $sql.query.getSingleBoxLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info,parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (已知客户编号)(时间排序)(箱子管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getSingleBoxLocateByTime", (req, res) => {
  var sql = $sql.query.getSingleBoxLocateByTime;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info,parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (已知客户编号)(时间排序)(箱子管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getSingleBoxLocateByName", (req, res) => {
  var sql = $sql.query.getSingleBoxLocateByName;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info,parms.customer_id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (出库记录)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getOutRecordLocate", (req, res) => {
  var sql = $sql.query.getOutRecordLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (出库记录)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getOutRecordLocate", (req, res) => {
  var sql = $sql.query.getOutRecordLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (出库记录)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getOutRecordLocate", (req, res) => {
  var sql = $sql.query.getOutRecordLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// (时间排序)(出库记录)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
router.post("/getOutRecordLocateByTime", (req, res) => {
  var sql = $sql.query.getOutRecordLocateByTime;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 客户信息模糊查询
router.post("/getCustomerDialogLocate", (req, res) => {
  var sql = $sql.query.getCustomerDialogLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});

// 货物信息模糊查询
router.post("/getProductDialogLocate", (req, res) => {
  var sql = $sql.query.getProductDialogLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});
// 箱子信息模糊查询
router.post("/getBoxDialogLocate", (req, res) => {
  var sql = $sql.query.getBoxDialogLocate;
  var parms = req.body;
  console.log(parms);
  conn.query(sql, [parms.customer_info], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
});
module.exports = router;
