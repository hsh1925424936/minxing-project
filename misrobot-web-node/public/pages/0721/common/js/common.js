function errcodefn(res){//公用错误码函数
    if(res.errcode==3106){
        layer.msg("登录信息已失效，请重新登录");
        setTimeout(function(){
            window.top.location.href="login.html"
        },3000)
    }else{
        layer.msg(res.errdesc);
    }
};
function errfn(){//公用连接失败函数
    layer.msg("连接服务失败")
};
function post(url,data,callback,errcodefn,errfn){//公用ajax函数,xieyindong

    data=JSON.stringify({ "1":data });
    var req=new XMLHttpRequest();
    req.open('POST',url);
    //req.setRequestHeader("content-Type","application/json;charset=utf-8");
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
                shade: 'transparent'
            });
        }

        options.url = options.url+'?timestr='+new Date().getTime();
        data=JSON.stringify({ "1":options.data });
        var req=new XMLHttpRequest();
        req.open('POST',options.url);
        //req.setRequestHeader("content-Type","application/json;charset=utf-8");
        req.onreadystatechange=function(){
            if(req.readyState==4){
            	layer.close(my_require.shade);
                if(req.status==200){
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
                    errfn();
                }
            }
        };
        req.send(data);

    }
    
}

function IsPC() {//判断设备是否pc
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

//给小于10的加0
function addzero(n) {
    return n<10?"0"+n:n;
}

function findurl(name) {
    var str = window.location.href;
    var i = str.indexOf("?");
    var _i = str.indexOf("#");
    if (_i<i) {
        _i = str.length;
    }
    if (i!=-1) {
        str = str.substring(i+1,_i);
        var arr = str.split("&");
        for (var i = 0 ; i <arr.length; i++) {
            var _arr = arr[i].split("=");
            if (_arr[0]==name) {
                return  _arr[1];
            }
        }
    }
    return "";
}

function isnull(str) {
    return str==undefined?'0':str;
}

//时间格式转时间戳
function datetotime(dateStr){
    if (dateStr.indexOf('.')!=-1) {
        dateStr.substring(0,dateStr.indexOf('.'));
    }
    var newstr = dateStr.replace(/-/g,'/');
    var date =  new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str.substr(0,10);
}

//设置cookie
function setCookie(name,value,iDay) {
    //$.cookie(name, value, {expires: iDay});

    if ( iDay == '' ) {//随浏览器关闭cookie失效
        document.cookie=name+"="+value+";Path=/";

    }else{
        var oDate = new Date();
        if (iDay>10) {
            oDate.setMinutes(oDate.getMinutes()+iDay);
        } else {
            oDate.setDate(oDate.getDate()+iDay);
        }
        document.cookie=name+"="+value+";expires="+oDate+";Path=/";
    }

    
}

//获取cookie
function getCookie(name) {
    var arr = document.cookie.split("; ");
    for (var i = 0 ; i<arr.length; i++) {
        var _arr = arr[i].split("=");
        if (_arr[0]==name) {
            return _arr[1];
        }
    }
    return "";
}
//删除cookie
function removeCookie(name) {
    setCookie(name,"",-1);
}