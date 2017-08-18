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
    })

})