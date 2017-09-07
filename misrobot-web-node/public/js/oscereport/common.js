
function errcodefn(res){//公用错误码函数
    if(res.errcode==9904){
        layer.msg("登录信息已失效，请重新登录");
        setTimeout(function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
            window.location.href="login.html"
        },3000)
    }else{
        layer.msg(res.errdesc)
    }
};
function errfn(){//公用连接失败函数
    layer.msg("连接服务失败")
};
function post(url,data,callback,errcodefn,errfn){//公用ajax函数
    url = 'http://192.168.1.200:8086'+url;
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
function setCookie(name,value,iDay) {//设置cookie
    var oDate = new Date();
    if (iDay>10) {
        oDate.setMinutes(oDate.getMinutes()+iDay);
    } else {
        oDate.setDate(oDate.getDate()+iDay);
    }
    document.cookie=name+"="+value+";expires="+oDate+";Path=/";
};
function getCookie(name) {//获取cookie
    var arr = document.cookie.split("; ");
    for (var i = 0 ; i<arr.length; i++) {
        var _arr = arr[i].split("=");
        if (_arr[0]==name) {
            return _arr[1];
        }
    }
    return "";
};
function removeCookie(name) {//删除cookie
    setCookie(name,"",-1);
};
function setCalendar(elem,use){
    var timer=setTimeout(function(){
        $(elem).datepicker({
            dateFormat: 'yy-mm-dd', inline: true,
            monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
            onSelect: function (dateText, inst) {
                var theDate = new Date(Date.parse($(this).datepicker('getDate')));
                if(use=="courseDate"){
                    courseDate=$.datepicker.formatDate('yy-mm-dd', theDate);
                };
                if(use=="preExeDate"){
                    preExeDate = $.datepicker.formatDate('yy-mm-dd', theDate);
                }
            },
            firstday:1
        });//初始化jqueryui日历
    },1000);
};
function setCalendarInput(elem){
    $(elem).datepicker({
        dateFormat: 'yy-mm-dd', inline: true,
        monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
        firstday:1
    });//初始化jqueryui日历
};
function closeAll(){//关闭本层iframe
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
    //var ifr = document.getElementByTagName("iframe");
    //ifr.top.close()
};
function logout(){//session失效直接跳到登录页,当前版本（2017.2.17） 暂未使用
    window.top.location.href="login.html"
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
}

var my_require = {//ajax方法
    R:function(options){
        if ( options.isRepeat ){//isRepeat传入目标元素,防止元素频繁点击
            if( !options.isRepeat.bWait ){
                options.isRepeat.bWait = true;
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
                layer.close(my_require.shade);
                if( options.isRepeat ){
                    options.isRepeat.bWait = false;
                }
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

//获取url参数
function GetQueryString(name) {//获取url参数值
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}