/**
 * Created by Administrator on 2016/5/25 0025.
 */
/*上传头像*/
$(".uploadHeadImg").click(function(){
    $("#fileupload").click();
});
$("body").on('change','#fileupload',function(){
    var files = document.getElementById("fileupload").files;
    var typeArr="";
    var type="";
    var totalSize = 0;
    for(var i=0;i<files.length;i++){
        totalSize += files[i].size/(1024*1024);
        typeArr = files[i].name.split(".");
        type = typeArr[typeArr.length-1];
        if(type!="jpg" && type!="jpeg" && type!="png"){
            layer.alert(
                "请上传图片文件",
                {title:["温馨提示","font-size:16px;color:#408aff"]}
            );
            return false;
        }
    }

    if (totalSize > 20) {
        layer.alert(
            "图片大小不能超过20MB",
            {title:["温馨提示","font-size:16px;color:#408aff"]}
        );
        return false;
    }
    $.ajaxFileUpload({
        type:"post",
        url:'',
        fileElementId:'fileupload',//必须要是 input file标签 ID
        dataType:"JSON",
        async: false,
        success: function ( status){//上传成功，后台返回图片路径，替换掉原图片路径
            $(".user-head-img").attr("src",status);
        },
        error: function (data, e){
            layer.alert(
                "上传失败！",
                {title:["温馨提示","font-size:16px;color:#408aff"]}
            );
        }
    });
})

// function openSearch() {
//     console.log('js/@@#@');
//     if ($('.searchForm').is(':visible')) {
//         $('.smsearch').show();
//         $('.searchForm').hide();
//     }
//     else {
//         $('.smsearch').hide();
//         $('.searchForm').show();
//     }
// }

var shade = {//生成遮罩的方法
    shadeOpen:function(){
        $('body').append('<div class="myshade" style="width:100%;'+
            'height:100%; background-color:rgba(0,0,0,0.5); position:fixed;'
            +'z-index:100; top:0; left:0;"></div>');
    },
    shadeClose:function(){
        $('.myshade').remove();
    }
 }

function close_iframe(){//关闭iframe弹窗的方法,在父窗口的方法，供子框架网页调用
    shade.shadeClose();
    $('#iframe_dialog').remove();
}

// $(function() {
//     $('.closeSpan').click(function() {//点击左上角关闭iframe
//         parent.close_iframe();
//     });
//     $('.closeBtn').click(function() {//点击关闭按钮关闭iframe
//         parent.close_iframe();
//     });
// });

function open_dialog(src){//打开弹窗的方法

    shade.shadeOpen();
    $('body').append('<iframe src="'+src+'" id="iframe_dialog" style="display:block;'+
        'position:fixed; left:50%; top:50%;'+
        'border-radius:5px; z-index:110; background-color:white; width:0px; height:0px;"></iframe>');
        $('#iframe_dialog').load(function() {
            $(this).contents().find("html").css('overflow', 'hidden');
            var children = $(this).contents().find("body").children();
            var width = parseInt(children.css('width'));
            var height = parseInt(children.css('height'));
            $(this).css('width', width+'px'); $(this).css('margin-left', (-width/2)+'px');
            $(this).css('height', height+'px'); $(this).css('margin-top', (-height/2)+'px');

            $(this).contents().find(".closeSpan").click(function() {//点击左上角关闭iframe
                parent.close_iframe();
            });
            $(this).contents().find(".closeBtn").click(function() {//点击左上角关闭iframe
                parent.close_iframe();
            });

            //让iframe可拖动
            var drag_obj = $(this).contents().find('.topCon');//被拖动的元素
            drag_obj.css('cursor', 'move');
            drag_obj.mousedown(function(event) {
                //存放初始鼠标的位置
                drag_obj._x = event.pageX;
                drag_obj._y = event.pageY;
                drag_obj.mousemove(function(e){
                    var change_x = e.pageX-drag_obj._x;//x方向的变化值
                    var change_y = e.pageY-drag_obj._y;//y方向的变化值
                    parent.drag_iframe(change_x,change_y);
                });

            });
            drag_obj.mouseup(function(event) {
                drag_obj.unbind("mousemove");
            });

            var iframe_dialog = $(this);
            $(window).resize(function() {
                iframe_dialog.css('left', '50%');
                iframe_dialog.css('top', '50%');
            });


        });
}

function drag_iframe(change_x,change_y){//拖动iframe的方法
    var pre_left = $('#iframe_dialog').css('left'); pre_left = parseInt(pre_left);
    var now_left = pre_left+change_x; now_left = now_left+'px';

    var pre_top = $('#iframe_dialog').css('top'); pre_top = parseInt(pre_top);
    var now_top = pre_top+change_y; now_top = now_top+'px';

    $('#iframe_dialog').css('left',now_left);

    $('#iframe_dialog').css('top',now_top);
}

//c++的交互
var c_interface = {
    //回调函数
    getLoginInfo:function(options){//获取登录信息

        if( typeof(qt)=="undefined" ){
            if( getCookie('content') ){//在智能助教重新加载时执行
                
                    var loginInfo = '';
                    options.fn(loginInfo);

            }else{//在网页环境中执行
                var loginInfo = {
                    sessionid:"bcb4ad2846d945bb4d6736d1d2db7252",
                    loginid:"132",
                    uid:"132",
                    scheduleid_onLogin:"583"
                }
                setCookie('sessionid',loginInfo.sessionid,7);
                setCookie('loginid',loginInfo.loginid,7);
                setCookie('uid',loginInfo.uid,7);
                setCookie('scheduleid',loginInfo.scheduleid_onLogin);
                setCookie('scheduleid_onLogin',loginInfo.scheduleid_onLogin,7);
                options.fn(loginInfo);
                console.log('没有获取到c++消息!');
            }
            return false;
        }
        new QWebChannel(qt.webChannelTransport, function(channel) {//启动智能助教时建立连接获取消息
            var content = channel.objects.content;
            setCookie('content',1,7);
            //回调函数(用来接收c++的消息)
            content.sendText.connect(function(message) {
                var newstr=message.replace(/\&quot;/g,'"');//将c++传过来的用户登陆信息先转换成json对象。
                var loginInfo=JSON.parse(newstr);
                //需要获取登录信息后执行的函数
                setCookie('sessionid',loginInfo.sessionid,7);
                setCookie('loginid',loginInfo.loginid,7);
                setCookie('uid',loginInfo.uid,7);
                setCookie('scheduleid',loginInfo.scheduleid_onLogin);
                setCookie('scheduleid_onLogin',loginInfo.scheduleid_onLogin,7);
                setCookie('starttime',loginInfo.starttime,7);
                setCookie('coursename',loginInfo.coursename,7);
                options.fn(loginInfo);
            });
            content.SendLoginData();
            
        });

    },

    sendInfo:function(options){
        if( typeof(qt) == 'undefined' ){
            if( getCookie('content') ){
                var content = JSON.parse(getCookie('content'));
                options.fn(content);
            }else{
                var content = {};
                content.switchToGroupPage = function(){
                    alert('跳转到分组页面');
                };
                options.fn(content);
            }
        }else{
            new QWebChannel(qt.webChannelTransport, function(channel) {
                var content = channel.objects.content;
                options.fn(content);
            });
        }
    }
}

//调用上面的方法格式
// c_interface.getLoginInfo({
//     fn:function(loginInfo){
//     }
// });

// window.onerror=function(msg,url,line){
//     alert("错误："+msg+"url:"+url+"行数："+line);
// };


function writeradar_1(options){//画雷达图
    var fontColor = options.bg?'#000':'#fff';
    var nameColor = options.nameColor;
    options.bg = options.bg||'#0496ca';
    options.line = options.line||'#0496ca';
    options.type = options.type||'dotted';
    options.color = options.color||'rgba(0,0,0,0)';
    options.show = options.show||false;
    options.animation = options.animation||true;
    var obj = options.obj;
    obj.myChart = echarts.init(obj);
    obj.option = {
        animation:options.animation,
        backgroundColor:options.bg,
        title : {
            show:false
        },
        tooltip : {
            show:options.show,
            trigger: 'axis',
            formatter : '{d}：{c}分'
        },
        legend: {
            show:false,
            x : 'center',
            data:['']
        },
        toolbox: {
            show : false     //工具栏
        },
        calculable : false,  //可拖动
        polar : [
            {
                indicator : options.name,
                axisLine: {            // 坐标轴线
                    show: true,// 默认显示，属性show控制显示与否
                    lineStyle:{
                        type:'dashed'
                    }
                },
                splitArea : {
                    show : true,
                    areaStyle : {
                        color: [options.bg,options.bg]
                    }
                },
                name:{
                    textStyle: {
                        color:nameColor?nameColor:fontColor,
                        fontSize: 13
                    }
                }
            }
        ],
        series : [
            {
                name: '',
                type: 'radar',
                data : [
                    {
                        symbolSize:0,
                        itemStyle: {
                            normal: {
                                color: options.line,
                                lineStyle:{
                                    width: 2,
                                    type: options.type
                                },
                                areaStyle:{
                                    color:options.color
                                }
                            }
                        },
                        value :options.value,
                        name : ''
                    }

                ]
            }
        ]
    };
    obj.myChart.setOption(obj.option);
}


