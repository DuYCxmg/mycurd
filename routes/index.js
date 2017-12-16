//导入post操作的集合
var  Post = require("./post")
//引入一个加密的插件
var crypto = require('crypto')
//引入user集合操作
var User =require("./user")
/* GET home page. */

module.exports =function(app){
    //展示页面
    app.get("/",function(req,res){
        var  page = parseInt(req.query.page) || 1;
        Post.getAll(null,page,function(err,docs,total){
            if(err){
                req.flash("error",err);
                return res.redirect("/");
            }
            res.render("index",{
                title:"首页",
                docs:docs,
                page:page,//当前页数
                isFirstPage:(page - 1 )*5 ==0,
                isLastPage:(page - 1 )*5+docs.length ==total,
                success:req.flash("success").toString(),
                error:req.flash("error").toString()
            })
        })
    });
    //注册页面
    app.get("/add",function(req,res){
        res.render("/",{
            title:"shouye",
            username:"",
            phone:"",
            email:"",
            time:"",
            success:req.flash("success").toString(),
            error:req.flash("error").toString()
        })

    })
    //注册行为
    app.post("/add",function(req,res){
    //获取页面数据
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;
        var phone = req.body.phone;
        var email =req.body.email;
        if( password != password2){
        //提示用户密码不一样
            req.flash("error","THE TWO PASSWORDS DO NOT MATCH");
            return res.redirect("/");
        }
        //对密码进行加密
        var md5 =crypto.createHash("md5");
        password = md5.update(req.body.password).digest("hex");
        var newUser =new User({
            username:username,
            password:password,
            email:email,
            phone:phone
        });
    //    判断用户是否存在
        User.get(newUser.username,function(err,user){
            if(err){
                req.flash("error",err);
                return res.redirect("/");
            }
            if(user){
                req.flash("error","THE USER NAME ALREADY EXISTS");
                return res.redirect("/");
            }
        // 将用户信息存入数据库，并且跳转到首页
            newUser.save(function(err,user){
                if(err){
                    req.flash("error",err);
                    return  res.redirect("/");
                }
                req.session.username =newUser;
                req.flash("success","REGISTRATION SUCCESS");
                res.redirect("/");
            })
        })
    })
   //删除
    app.get("/delete/:name",function(req,res){
      Post.remove(req.params.name,function(err){

          if(err){
              req.flash("error",err);
              return res.redirect("/");
          }
          req.flash("success","DELETE SUCCESS");
          return res.redirect("/");
      })
    })
    //修改页面
    app.get("/update/:name/:email/:phone",function(req,res){
        Post.update(req.params.name,req.params.email,req.params.phone,function(err,doc){
               if(err){
                   req.flash("error",err);
                   return res.redirect("/");
               }
               return res.render("update",{
                   title:"UPDATE",
                   user:req.session.user,
                   success:req.flash("success").toString(),
                   error:req.flash("error").toString(),
                   doc:doc
               })
        })
    })
  //修改操作
    app.post("/change",function(req,res){
        Post.change(req.body.username,req.body.time,req.body.email,req.body.phone,function(err,doc){
           if(err){
               req.flash("error",err);
               return res.redirect("/");
           }
           req.flash("success","CHANGE SUCCESS");
           return res.redirect("/");
       })
    })
 //查询

    app.get("/search",function(req,res){
        var  page = parseInt(req.query.page) || 1;
        Post.search(req.query.searchname,page,function(err,docs,total){
            if(err){
                res.flash("error",err);
                return res.redirect("/");
            }
            req.flash("success","Find relevant information");
            return res.render("index",{
                title:"BootStrap",
                docs:docs,
                page:page,
                isFirstPage:(page - 1 )*5 ==0,
                isLastPage:(page - 1 )*5 +docs.length ==total,
                success:req.flash("success").toString(),
                error:req.flash("error").toString()
            })
        })
    })
};

