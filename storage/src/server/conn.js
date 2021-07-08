var mysql = require('mysql');

// 上线项目 数据库链接地址
 var connection = {
     host: 'localhost',
     user: 'erp_mysql',
     password: 'Adadasd001', // mysql用户名密码
     database: 'erp_mysql', // mysql数据库名
     port: '3306' // mysql链接端口
 }

// 上线项目 数据库链接地址
//  var connection = {
//      host: 'localhost',
//      user: 'erp_mysql_test',
//      password: 'Adadasd001', // mysql用户名密码
//      database: 'erp_mysql_test', // mysql数据库名
//      port: '3306' // mysql链接端口
//  }

// 开发项目 数据库连接地址
// var connection = {
  // host: 'localhost',
 //  user: 'root',
 //  password: 'bishe123', // mysql用户名密码
 //  database: '99erp', // mysql数据库名
 //  port: '3306' // mysql链接端口
//}

// 用于保存数据连接实例
var db = null;

var pingInterval;

// 如果数据连接出错，则重新连接
function handleError(err) {
    console.log(err.stack || err);
    connect();
}

// 建立数据库连接
function connect() {
    if (db !== null) {
        db.destroy();
        db = null;
    }

    db = mysql.createConnection(connection);
    db.connect(function (err) {
        if (err) {
            console.log("error when connecting to db,reConnecting after 2 seconds:", err);
            setTimeout(connect, 2000);
        }
    });
    db.on("error", handleError);

    // 每个小时ping一次数据库，保持数据库连接状态
    clearInterval(pingInterval);
    pingInterval = setInterval(() => {
        console.log('ping...');
        db.ping((err) => {
            if (err) {
                console.log('ping error: ' + JSON.stringify(err));
            }
        });
    // }, 3600000);
    }, 14400000);
}
console.log("mysqljs被引入了")
connect();
module.exports = db;
