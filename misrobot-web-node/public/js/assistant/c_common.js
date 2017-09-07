/**
 * Created by misrobot on 2017/6/19.
 */
document.onmousedown = function(e){  
    var e = e || window.event
    if(e.button == 1){
        location.reload(true);
    }  
}
document.onkeyup = function(e){
    if( e.keyCode == 116 ){
        location.reload(true);
    }
}
console.error = function (msg){
    alert(msg);
}
var gotC = {
    c_listen:{login_info:false},
    allgot:function(){
        var isallgot = true;//判断是否所有的c#请求都已获取到
        for(var i in gotC.c_listen){
            if( gotC.c_listen[i] == false ){
                isallgot = false;
            }
        }
        return isallgot;
    },
    fn:function(){},//存放页面的逻辑代码
    callback:function(){
        if( this.allgot() ){
          this.fn();
        }
        
    },
    init:function(opt){
        this.fn = opt.fn;
        if (opt.current_course_info){
            this.c_listen.current_course_info = false;
        }
        $(function(){
            var event = document.createEvent('MessageEvent');
            // TODO 获取sessionid和loginid
            var event = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': '{"command":"getLoginInfo"}'});
            document.dispatchEvent(event);

            if( opt.current_course_info ){
                setTimeout(function(){
                    var event = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': '{"command":"getCurrentCourseInfo"}' });
                    document.dispatchEvent(event);
                },100);
                
            }
            
        });
    },
    logout_cs:function(){
        var event = document.createEvent('MessageEvent');
        // TODO 返回到csharp的登陆页
        var event = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': '{"command":"setLogout","withConfirm":"0"}'});
        document.dispatchEvent(event);
    }
};

window.onerror = function (a, b, c) {
    alert(a + b + c)
};

function ReceiveFor_getLoginInfo(data){
    data = JSON.parse(data);
    setCookie('sid',data.sessionid,7);
    setCookie('loginid',data.userid,7);
    setCookie('uid',data.userid,7);
    gotC.c_listen.login_info = true;
    gotC.callback();
}

function ReceiveFor_getCurrentCourseInfo(data){
    data = JSON.parse(data);
    setCookie('scheduleid',data.scheduleid,7);
    gotC.c_listen.current_course_info = true;
    gotC.callback();
}
//TODO 储存课程信息
function setClassInfo(prama){
    var classinfo = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false,'data':'{"command":"setCurrentCourseInfo","currentCourseInfo":'+prama+'}'});
    document.dispatchEvent(classinfo);
}
//TODO 跳转到上课页面
function toClass(){
    var toclass = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': '{"command":"setMainForm"}' });
    document.dispatchEvent(toclass);
}
//TODO 打开投影
function openProject(){
    var open = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': '{"command":"setProject","onoff":1}' });
    document.dispatchEvent(open);
}
//TODO 关闭投影
function closeProject(){
    var close = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': '{"command":"setProject","onoff":0}' });
    document.dispatchEvent(close);
}
//TODO 通知C# onload
function sendonload(){
    var ready = new MessageEvent('callMe', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': '{"command":"setWebDocStartOnload"}' });
    document.dispatchEvent(ready);
}



