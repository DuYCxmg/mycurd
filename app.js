var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//引入数据库配置文件
var setting = require("./setting");
//flash插件
var flash= require("connect-flash");
//session插件
var session =require("express-session");
//session存放数据库插件
var MongoStore =require("connect-mongo")(session);

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//使用flash()
app.use(flash());
//使用session
app.use(session({
//    加密
    secret:setting.cookieSecret,
//    cookie过期时间
    cookie:{maxAge:1000*60*60*24*30},
//    加密
    key:setting.db,
//    连接数据库
    store:new MongoStore({
        url:"mongodb://localhost/my"
    }),
//    是否强制保存回话
    resave:false,
//    会话未修改的时候，是否保存
    saveUninitialized:true

}));
routes(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(1314,function(){
  console.log("my 1314 is running")
})

module.exports = app;
