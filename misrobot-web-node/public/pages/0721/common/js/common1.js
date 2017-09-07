
function errcodefn(res){//公用错误码函数
    if(res.errcode==9904){
        layer.msg("登录信息已失效，请重新登录");
        setTimeout(futureAppLogout,2000)
    }else{
        layer.msg(res.errdesc)
    }
};
function errfn(){//公用连接失败函数
    layer.msg("连接服务失败")
};
function post(url,data,callback,errcodefn,errfn){//公用ajax函数

    data=JSON.stringify({ "1":data });
    var req=new XMLHttpRequest();
    req.open('POST',url);
    req.setRequestHeader("content-Type","application/json;charset=utf-8");
    req.onreadystatechange=function(){
        if(req.readyState==4){
            if(req.status==200){
                if(typeof(req.responseText)=="string"){
                    var response=JSON.parse(req.responseText)["1"];
                }else{
                    var response=req.responseText["1"]
                };
                if(response.errcode==0){
                    callback(response)
                }else{
                    errcodefn(response)
                }
            }else{
                errfn()
            }
        }
    };
    req.send(data)
};
function setCookie(name,value) {//设置cookie
    value=encodeURIComponent(value);
    document.cookie=name+"="+value;
};
function getCookie(name) {//获取cookie
    var arr = document.cookie.split("; ");
    for (var i = 0 ; i<arr.length; i++) {
        var _arr = arr[i].split("=");
        if (_arr[0]==name) {
            return decodeURIComponent(_arr[1]);
        }
    }
    return "";
};
function removeCookie(name) {//删除cookie
    setCookie(name,"",-1);
};
function notRepeat(arr){//数组去重函数
    var noRepeat=[];
    noRepeat[0]=arr[0];
    for(var i=1;i<arr.length;i++){
        var repeat=false;
        for(var j=0;j<noRepeat.length;j++){
            if(arr[i]==noRepeat[j]){
                repeat=true;
                break
            }
        };
        if(!repeat){
            noRepeat.push(arr[i]);
        }
    };
    return noRepeat
};
function deleteItem(arr,num){//给数组删除index元素
    delete arr[num];
    var temp=[];
    for(index in arr){
        temp.push(arr[index])
    };
    return temp
};
function setupWebViewJavascriptBridge(callback) {//苹果桥
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
};
function futureAppLogout(){//明日良医退出登录
    invokeNative('Logout');
    /*if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1){
        window.JavaInterface.JavaScriptLogout(); //callback android OS logout function
    } else{
        // callback ios OS function
        setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('Logout', {}, function responseCallback(responseData) {});
        });
    }*/
};
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}//调用：var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
function queryTodoNum(){//查询任务条数
    if(getCookie('role')!=0){
        return 0
    }else{
        var json={
            command:"course/querycourseinfo",
            timetype:5,
            sessionid:getCookie('sid'),
            uid:getCookie('uid'),
            loginid:getCookie('uid'),
            advancetime:10
        };
        function callback(res){
            if(!res.schedules){//如果今天没有课
                return
            }else {//今天有课
                if(res.schedules[0].issigned==0){//今天的课还没有签到，才会显示到任务
                    vm.todonum=1
                }
                /*var nowMin = parseInt(new Date().getTime() / 60000);//当前时间的分钟数
                if (nowMinute(res.schedules[0].endtime) <= nowMin) {//今天有课，但都结束了
                    return
                } else {//今天有课，并且有没结束的
                    res.schedules.forEach(function (value, index) {
                        if ((nowMinute(value.starttime) - 10) <= nowMin && nowMinute(value.endtime) >= nowMin) {
                            if (value.issigned == 0) {//今天的课还没有签到，才会显示到任务
                                vm.todonum= 1;
                            }
                        };
                    });
                }*/
            }
        };
        post("/course/querycourseinfo",json,callback,errcodefn,errfn);
    }
};
function queryMsgNum(){//查询消息条数
    var data={
        command:'announce/queryannouncelist',
        sessionid:getCookie('sid'),
        loginid:getCookie('uid'),
        uid:getCookie('uid')
    }
    function callback(res){
        if(!res.allcount){
            vm.$set(vm.$data,"msgnum",0);
        }else{
            vm.$set(vm.$data,"msgnum",res.unreadcount);
        }
    }
    post('/announce/queryannouncelist',data,callback,errcodefn,errfn);
};
function nowMinute(timeformat){//把2017-01-05 00:00:00转换成分钟数
    var date=new Date();
    var timestr=timeformat.split(' ')[1];
    var daystr=timeformat.split(' ')[0];
    date.setFullYear(daystr.split('-')[0]);
    date.setMonth(daystr.split('-')[1]-1);
    date.setDate(daystr.split('-')[2]);
    date.setHours(timestr.split(':')[0]);
    date.setMinutes(timestr.split(':')[1]);
    date.setSeconds(timestr.split(':')[2]);
    return parseInt(date.getTime()/60000)
};
function nowSeconds(timeformat){//把2017-01-05 00:00:00转换成秒
    var date=new Date();
    var timestr=timeformat.split(' ')[1];
    var daystr=timeformat.split(' ')[0];
    date.setFullYear(daystr.split('-')[0]);
    date.setMonth(daystr.split('-')[1]-1);
    date.setDate(daystr.split('-')[2]);
    date.setHours(timestr.split(':')[0]);
    date.setMinutes(timestr.split(':')[1]);
    date.setSeconds(timestr.split(':')[2]);
    return parseInt(date.getTime()/1000)
}

var my_require = {//ajax方法
    R:function(options){
        if ( options.isRepeat ){//isRepeat传入目标元素,防止元素频繁点击
            if( !options.isRepeat.bWait ){
                options.isRepeat.bWait = true;
                setTimeout(function(){
                    options.isRepeat.bWait = false;
                },3000);
            }else{
                return false;
            }
        }

        if (options.isShade) {//请求时添加阴影
            my_require.shade = layer.load(1, {
                shade: [0.3,'#000'] //0.1透明度的白色背景
            });
        }


        data=JSON.stringify({ "1":options.data });
        var req=new XMLHttpRequest();
        req.open('POST',options.url);
        //req.setRequestHeader("content-Type","application/json;charset=utf-8");
        req.onreadystatechange=function(){
            if(req.readyState==4){
                if(req.status==200){
                    layer.close(my_require.shade);
                    if( !req.responseText ){
                        layer.msg( '服务器返回为空' );
                        return false;
                    }
                    if(typeof(req.responseText)=="string"){
                        var response=JSON.parse(req.responseText)["1"];
                    }else{
                        var response=req.responseText["1"]
                    };
                    if(response.errcode==0){
                        options.callback(response);
                    }else{
                        errcodefn(response);
                    }
                }else{
                    layer.close(my_require.shade);
                    errfn();
                }
            }
        };
        req.send(data);

    }
    
}

function invokeNative (methodName, param, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(methodName, param, function responseCallback(responseData) {
            callback && callback(responseData);
        });
    });
}

function registerToNative (name, method, callbackResponse) {
    // callback ios OS function
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler(name, function (data, responseCallback) {
            method && method(data);
    
            if(typeof responseCallback === 'function') {
                responseCallback(callbackResponse);
            }
        });
    });
}

function setStorageData(key, val) {

    if(window.sessionStorage) {
        window.sessionStorage.setItem(key, val);
    } else if(window.localStorage) {
        window.localStorage.setItem(key, val);
    }
}

function getStorageData(key) {
    if(window.sessionStorage) {
        return window.sessionStorage.getItem(key);
    } else if(window.localStorage) {
        return window.localStorage.getItem(key)
    }
}


setTimeout(function () {
    var num = getStorageData('taskNum');

    if(window.vm) {
        window.vm.todonum = num;
    }
}, 500);
function getuserrole(str){//判断用户角色，参数为角色字符串
    var role={}
    if(!str){
        layer.msg('角色信息错误')
        return
    }
    if(str.length==1){//如果是单一角色
        if(str=='0'){
            role={
                rolename:'student',
                roleid:0
            }
        }else if(str=='1'){
            role={
                rolename:'yunwei',
                roleid:1
            }
        }else if(str=='2'){
            role={
                rolename:'yunying',
                roleid:2
            }
        }else if(str=='3'){
            role={
                rolename:'teacher',
                roleid:3
            }
        }else{
            role={
                rolename:'teacher2',
                roleid:4
            }
        }
    }else{//如果是多重角色
        var arr=str.split(',')
        role={//默认为其它
            rolename:'otherrole',
            roleid:'1,2,4'
        }
        for(index in arr){
            if(arr[index]==0){
                role={
                    rolename:'student',
                    roleid:0
                }
            }else if(arr[index]==3){
                role={
                    rolename:'teacher',
                    roleid:3
                }
            }
        }
    }
    return role
}