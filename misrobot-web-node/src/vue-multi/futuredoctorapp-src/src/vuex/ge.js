var gefn={
	 errcodefn:function(){
        if(res.errcode==9904){
            layer.msg("登录信息已失效，请重新登录");
            setTimeout(this.futureAppLogout,2000)
        }else{
            layer.msg(res.errdesc)
        }
    },
    errfn:function(){
        layer.msg("连接服务失败")
    },
        post:function(url,data,callback,errcodefn,errfn){
        data=JSON.stringify({ "1":data });
        var req=new XMLHttpRequest();
        req.open('POST',url);
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
    },
    futureAppLogout:function(){//调用外部方法返回登录界面
        if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1){
            window.JavaInterface.JavaScriptLogout(); //callback android OS logout function
        } else{
            // callback ios OS function
            this.setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('Logout', {}, function responseCallback(responseData) {});
            });
        }
    },
};
export default gefn
