//连接数据库实例
var mongodb =require("../db");

function User(user){
    this.username=user.username;
    this.password=user.password;
    this.phone=user.phone;
    this.email=user.email;
}
//格式化时间函数
function formatDate(num){
    return num <10?"0"+num:num;
}

module.exports =User;

User.prototype.save =function(callback){
    //格式化时间
    var date =new Date();
    var now  =date.getFullYear()+"-"+formatDate(date.getMonth()+1)+"-"+
        formatDate(date.getDate())+" "+formatDate(date.getHours())+":"
        +formatDate(date.getMinutes())+":"+formatDate(date.getSeconds());
// 收集即将存入数据库的数据
    var user ={
        username:this.username,
        password:this.password,
        phone:this.phone,
        email:this.email,
        time:now
    }
    mongodb.open(function(err,db){
    //如果在打开数据库的时候发生了错误，将错误结果返回回调
        if(err){
            return callback(err);
        }
    //读取user集合
    db.collection("myusers",function(err,collection){
        if(err){
            mongodb.close();
            return callback(err);
        }
    //将数据插入到user集合里面
        collection.insert(user,{sade:true},function(err,user){
            mongodb.close();
            if(err){
                return callback(err);
            }
            callback(null,user[0]);
        })
    })
  })
};
User.get =function(name,callback){
//    打开数据库
    mongodb.open(function(err,db){
        if(err){
            mongodb.close();
        }
        db.collection("myusers",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({username:name},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,user);
            })
        })
    })
}