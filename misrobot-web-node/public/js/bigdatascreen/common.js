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

        options.url = 'http://192.168.1.200:18089'+options.url;
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
};