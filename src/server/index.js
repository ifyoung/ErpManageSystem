// node后端服务器
const queryApi = require("./api/queryApi");
const insertApi = require("./api/insertApi");
const deleteApi = require("./api/deleteApi");
const updateApi = require("./api/updateApi");
const bodyParser = require("body-parser");
const expressJWT = require("express-jwt");
var vertoken = require("./token");
// body-parser是非常常用的一个express中间件，作用是对http请求体进行解析

const express = require("express"); // express框架
const app = express();

//对所有返回数据的头部进行类型处理
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 后端api路由
app.use("/query", queryApi); // 使用queryApi文件中的接口
app.use("/insert", insertApi); // 使用insertApi文件中的接口
app.use("/delete", deleteApi); // 使用deleteApi文件中的接口
app.use("/update", updateApi); // 使用updateApi文件中的接口

// 获取请求头的token,判断该token值是否与服务端token值相同,是则获取数据
app.use(function(req, res, next) {
  var token = req.headers["authorization"];
  if (token == undefined) {
    return next();
  } else {
    vertoken
      .verToken(token)
      .then((data) => {
        req.data = data;
        return next();
      })
      .catch((error) => {
        return next();
      });
  }
  next(createError(404));
});

app.use(
  expressJWT({
    secret: "mes_qdhd_mobile_xhykjyxgs",
    algorithms: ["HS256"],
  }).unless({
    path: ["/"], //除了这个地址，其他的URL都需要验证
  })
);

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    if (err.status == 401) {
      return res.status(401).send('token失效');
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    // res.render('error');
  });

// 监听端口
app.listen(8083); // 监听server8085端口
console.log("success listen at port:8083");
