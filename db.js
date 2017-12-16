var setting =require("./setting");
//引入mongodb模块下面的db对象
var Db=require("mongodb").Db;
//引入mongodb数据库下面的Serve对象
var Server =require("mongodb").Server;

//数据库实例对象
module.exports  = new Db(setting.db,new Server(setting.host,setting.port),{safe:true});