var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

/**
 * 处理通用的数据
 * */
var data;
router.use(function(req, res, next){
    data = {
        userLoginInfo:req.userLoginInfo,
        categories:[]
    };
    Category.find().then(function(categories){
        data.categories = categories;
        next();
    })
});


/**
 * 首页
 * */
router.get('/', function(req, res, next){

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 2;
    data.pages = 0;

    var where = {};
    if(data.category){
        where.category = data.category;
    }

    Content.where(where).count().then(function(count){

        data.count = count;

        //计算总页数
        data.pages = Math.ceil(data.count/data.limit);//向上取整
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于1
        data.page = Math.max(data.page, 1);

        var skip = (data.page-1)*data.limit;


        return Content.where(where).find().sort({_id:-1}).limit(2).skip(skip).populate(['category', 'user']).sort({
            addTime:-1
        });
    }).then(function(contents){
        data.contents = contents;
        //console.log(data);
        res.render('template/index',data);
    });
});

router.get('/view', function(req, res){
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        data.content = content;

        content.views++;
        content.save();
        // console.log(data);
        res.render('template/view',data);
    })
});


module.exports = router;