//连接数据库操作的实例
var mongodb =require("../db");
//创造一个构造函数 命令为 Post 里面有 name password phone email属性
function Post(name,password,phone,email){
    this.username= name;
    this.password = password;
    this.phone = phone;
    this.email =email;
}
Post.prototype.save =function(callback){

};
//首页获取所有的用户信息的函数
Post.getAll= function(name,page,callback){
    // 打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取数据库的myusers集合
        db.collection("myusers",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.count(query,function(err,total){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                collection.find(query,
                    {
                        skip:(page-1)*5,
                        limit:5
                    }).sort({time:-1}).toArray(function(err,docs){
                    mongodb.close();
                    if(err){
                        return  callback(err);
                    }
                    return callback(null,docs,total);
                })
            })
        })
    })
};
//删除用户信息的函数
Post.remove = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("myusers",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
              username:name
            },{
                w:1
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })

        })
    })
};
//修改用户信息的请求函数
Post.update= function(name,email,phone,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("myusers",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                username:name,
                phone:phone,
                email:email
            },function(err,doc){
                mongodb.close();
                return callback(null,doc);
            })
        })
    })
};
//修改用户信息的行为函数
Post.change=function(name,time,phone,email,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("myusers",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
                    collection.update({
                        username:name
                    },{
                        $set:{phone:phone, email:email}
                    },function(err,doc){
                        mongodb.close();
                        if(err){
                            return callback(err);
                        }
                        return callback(null,doc);
                    })
        })
    })
};
//查询用户操作函数
Post.search =function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("myusers",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var newRegex =new RegExp(name,"i");
            collection.find({
                username:newRegex
            },{
                username:1,
                phone:1,
                email:1,
                time:1
            }).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,docs);
            })
        })
    })
}
module.exports = Post;