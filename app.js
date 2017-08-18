/**
 * 应用程序的启动（入口）文件
 */


 //加载express模块
 var express = require('express');

//加载模板处理模块
var swig = require('swig');

//加载数据库模块
var mongoose = require('mongoose');

//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');

//加载cookie模块，保存用户登录状态
var cookies = require('cookies');

 //创建APP应用  =>nodeJs  http.createServer()
 var app = express();

 var User = require('./models/User');


//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应的__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'));


/**
 *  配置应用模板
    定义当前应用所使用的模板引擎
    第一个参数表示模板引擎的名称，同时也是模板文件的后缀
    第二个参数表示用于解析处理模板内容的方法
 */
 app.engine('html', swig.renderFile);


 /**
  * 设置模板文件存放的目录
    第一个参数必须是views
    第二个参数是模板文件存放的目录
  */
 app.set('views', './views');


 //注册模板引擎 第一个参数必须是view engine， 
 //第二个参数和app.engine()方法中定义模板引擎的名称（第一个参数）是一致的
 app.set('view engine', 'html');

//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});


// app.get('/*',function(req,res,next){
//     res.header({'Content-Type': 'text/plain'} , 0 );
//     next(); 
// });


//body-parser设置
app.use(bodyParser.urlencoded({extended:true}));

//cookies设置
app.use(function(req, res, next){
    req.cookies = new cookies(req, res);
    
    //解析用户登录的cookie信息
    req.userLoginInfo = {};
    if(req.cookies.get('loginInfo')){
        try{
            req.userLoginInfo = JSON.parse(req.cookies.get('loginInfo'));

            //获取当前用户的类型，普通用户或是管理员
            User.findById(req.userLoginInfo._id).then(function(userInfo){
                req.userLoginInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            throw e;
            next();
        }
    }else{
        next();
    }
    // console.log(req.cookies.get('userInfo'));
    
})



/**
 * 根据不同的功能划分模块
 */

 app.use('/admin', require('./routes/admin'));
 app.use('/api', require('./routes/api'));
 app.use('/', require('./routes/main'));



 /**
  * 首页
  req: request对象
  res: response对象
  next: 函数
  */
//  app.get('/', function(req, res, next){
//     // res.send('<h1>welcome !</h1>');
//     /**
//      * 读取views目录下的指定文件，解析并返回给客户端
//      * 第一个参数：表示模板的文件，相对于views目录  views/index.html
//      * 第二个参数：传递给模板使用的参数
//      */
//     res.render('index');
//  });

//  app.get('/main.css', function(req, res, next){
//      res.setHeader('content-type', 'text/css');
//      res.send('body {background:skyblue}');
//  });


 //监听http请求
 mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://localhost:27018/blog', { useMongoClient: true }, function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
 });
