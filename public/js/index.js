$(function(){
    var $btn_click_register = $('#click-register');
    var $btn_click_login = $('#click-login');


    //切换到注册面板，
    $btn_click_register.bind('click',function(){
        $('#register').find('.tipMessage').html('');
        $('#register').show();
        $('#login').hide();
    });

    //切换到登录面板
    $btn_click_login.bind('click',function(){
        $('#login').find('.tipMessage').html('');
        $('#register').hide();
        $('#login').show();
    });


    //处理用户注册
    $('#register').find('button').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$('#register').find('[name="username"]').val(),
                password:$('#register').find('[name="password"]').val(),
                repassword:$('#register').find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(data){
                console.log(data);
                $('#register').find('.tipMessage').html(data.message);
                if(!data.code){//非0为true，即为注册成功
                    setTimeout(function(){
                        $('#register').hide();
                        $('#login').show();
                    },1000)
                }
            }
        })
    });


    //处理用户登录
    $('#login').find('button').on('click', function(){
        //通过ajax发送请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$('#login').find('[name="username"]').val(),
                password:$('#login').find('[name="password"]').val()
            },
            dataType:'json',
            success:function(result){
                console.log(result);
                $('#login').find('.tipMessage').html(result.message);
                if(!result.code){
                    // setTimeout(function(){
                    //     $('#userInfo').show();
                    //     $('#login').hide();
                    //     $('#userInfo').find('.username').html(result.userInfo.username);
                    // },1000)
                    window.location.reload();
                }
            }
        })
    });

    $('#logout').on('click',function(){
        $.ajax({
            type:'get',
            url:'/api/user/logout',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    });


    /**
     * 评论分页
     */
    var limit = 2;
    var page = 1;
    var pages = 0;
    var comments = [];

    /**
     * 提交评论
     */
    $('#messageSub').click(function(){
        $.ajax({
            type:'POST',
            url:'/api/comment/post',
            data:{
                contentid:$('#contentId').val(),
                content:$('#messageCon').val()
            },
            success:function(msg){
                // console.log(msg);
                comments = msg.data.comments.reverse();
                rederComment();
            }

        })
    });

    $.ajax({
        type:'GET',
        url:'/api/comment',
        data:{
            contentid:$('#contentId').val()
        },
        success:function(msg){
            // console.log(msg);
            comments = msg.data.comments.reverse();
            rederComment();
        }
    });

    /**
     * 事件委托评论内容分页
     */
    $('.commentPage').delegate('a','click', function () {
        if($(this).hasClass('previous')){
            page--;
        }
        if($(this).hasClass('next')){
            page++;
        }
        rederComment();
    });

    /**
     * 渲染评论
     * @param comments
     */
    function rederComment() {
        $('#commentCount').html(comments.length);

        pages = Math.max(Math.ceil(comments.length/limit), 1);
        var start = Math.max(0,(page-1)*limit);
        var end = Math.min(start+limit, comments.length);
        var $lis = $('.page-number.lineH');
        $lis.html('第'+page+'/'+pages);

        if(page<=1){
            page = 1;
            $('.commentPage a').eq(0).html('');
        }else{
            $('.commentPage a').eq(0).html('<i class="fa fa-angle-left line"></i>');
        }
        if(page>=pages){
            page = pages;
            $('.commentPage a').eq(1).html('');
        }else{
            $('.commentPage a').eq(1).html('<i class="fa fa-angle-right line"></i>');
        }

        if(comments.length == 0){
            $('.messageList').html('<P class="font-12 martop-20">还没有评论</P>');
        } else{
            var html = '';
            for(var i=start;i<end;i++){
                html+='<div class="comment">'+
                    '<p>'+
                    '<span class="left">'+comments[i].username+'</span>'+
                    '<span class="right">'+formatDate(comments[i].postTime)+'</span>'+
                    '</p>'+
                    '<p>'+comments[i].content+'</p>'+
                    '</div>';

            }
            $('.messageList').html(html);
        }
    }

    /**
     * 处理评论时间
     */
    function formatDate(d){
        var date1 = new Date(d);
        return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()+' '+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
    }


});