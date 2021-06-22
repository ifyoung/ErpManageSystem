// node后端服务器
const queryApi = require('./api/queryApi')
const insertApi = require('./api/insertApi')
const deleteApi = require('./api/deleteApi')
const updateApi = require('./api/updateApi')
const bodyParser = require('body-parser') 
// body-parser是非常常用的一个express中间件，作用是对http请求体进行解析

const express = require('express') // express框架
const app = express()

//对所有返回数据的头部进行类型处理
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 后端api路由
app.use('/query', queryApi) // 使用queryApi文件中的接口
app.use('/insert', insertApi) // 使用insertApi文件中的接口
app.use('/delete', deleteApi) // 使用deleteApi文件中的接口
app.use('/update', updateApi) // 使用updateApi文件中的接口

// 监听端口
app.listen(8083) // 监听server8085端口
console.log('success listen at port:8083')

