
import store from './store';
import methods from '../methods';

var xiefn={
    errcodefn:function(res){
        if(res.errcode==9904){
            store.commit('SHOW_ALERT', {
                msg:"登录信息已失效，请重新登录",
                cb:function(){

                },
                title:'提示'
            });
            setTimeout(xiefn.futureAppLogout,2000)
        }else{
            store.commit('SHOW_ALERT', {
                msg:res.errdesc,
                cb:function(){

                },
                title:'提示'
            });
        }
    },
    errfn:function(){
        store.commit('SHOW_ALERT', {
            msg:"连接服务失败，请稍后重试",
            cb:function(){

            },
            title:'提示'
        });
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
        methods.invokeNative('Logout');
    },
    setupWebViewJavascriptBridge:function(callback){//ios桥函数
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    },
    setCookie:function(name,value) {//设置cookie
        value=encodeURIComponent(value);
        document.cookie=name+"="+value;
    },
    getCookie:function(name){//获取cookie
        var arr = document.cookie.split("; ");
        for (var i = 0 ; i<arr.length; i++) {
            var _arr = arr[i].split("=");
            if (_arr[0]==name) {
                return decodeURIComponent(_arr[1]);
            }
        }
        return "";
    },
    confirmWifi:function(){//获取wifi信息函数
        if(navigator.userAgent.indexOf("iPhone")!=-1){//如果是苹果系统，保存登录信息,保存wifi状态
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('GetWiFiStatus', {'WIFIStatus': 'outSend'}, function responseCallback(responseData) {
                    currentWiFi=JSON.parse(responseData).currentWiFi;
                    designWiFi=JSON.parse(responseData).designWiFi;
                })
            })
        }else {
            result=window.JavaInterface.JavaScriptGetWiFiStatus("GetWiFiStatus");
            currentWiFi= JSON.parse(result).currentWiFi;//如果是GMC,data就等于GMC
            designWiFi=JSON.parse(result).designWiFi;
        }
    },
    whichday:function(dateformat){//'将2017-01-01'转换成当天是周几
        var year=dateformat.split('-')[0]
        var month=dateformat.split('-')[1]
        var day=dateformat.split('-')[2]
        if(month.toString()[0]==0){
            month=month.toString().slice(1)-1
        }else{
            month=month-1
        }
        if(day.toString()[0]==0){
            day=day.toString().slice(1)
        }
        var temp=new Date('2000-01-01')
        temp.setFullYear(year)
        temp.setMonth(month)
        temp.setDate(day)
        var x=''
        switch (temp.getDay()){
            case 0:
                x="周日";
                break;
            case 1:
                x="周一";
                break;
            case 2:
                x="周二";
                break;
            case 3:
                x="周三";
                break;
            case 4:
                x="周四";
                break;
            case 5:
                x="周五";
                break;
            case 6:
                x="周六";
                break;
        }
        return x
    },
    timetodate:function(num,n){//时间戳转时间
        var oDate = new Date();
        oDate.setTime(num*1000);
        var hours = oDate.getHours();
        if (n=='1') {
            var str = oDate.getFullYear()+'-'+this.addzero(oDate.getMonth()+1)+'-'+this.addzero(oDate.getDate());
        } else if (n=='2') {//xx:xx
            var str = this.addzero(oDate.getHours())+':'+this.addzero(oDate.getMinutes());
        } else if (n=='3') {//xx-xx xx:xx
            var str = this.addzero(oDate.getMonth()+1)+'-'+this.addzero(oDate.getDate())+' '+this.addzero(hours)+':'+this.addzero(oDate.getMinutes());
        } else if (n=='4') {//xxxx-xx-xx
            var str = oDate.getFullYear()+'-'+this.addzero(oDate.getMonth()+1)+'-'+this.addzero(oDate.getDate());
        } else if (n=='5') {
            var str = (oDate.getMonth()+1)+'月';
        } else if (n=='6') {
            var str = (oDate.getMonth()+1)+'月'+this.addzero(oDate.getDate())+'日'+' '+this.addzero(hours)+':'+this.addzero(oDate.getMinutes());
        } else if (n=='7') {//xxxx.xx.xx
            var str = oDate.getFullYear()+'.'+this.addzero(oDate.getMonth()+1)+'.'+this.addzero(oDate.getDate());
        } else if (n=='8') {//xx-xx
            var str = this.addzero(oDate.getMonth()+1)+'-'+this.addzero(oDate.getDate());
        } else if (n=='9') {//xxxx年xx月
            var str = oDate.getFullYear()+'年'+this.addzero(oDate.getMonth()+1)+'月';
        } else if (n=='10'){//xxxx-xx
            var str = oDate.getFullYear()+'-'+this.addzero(oDate.getMonth()+1);
        } else {//xxxx-xx-xx xx:xx
            var str = oDate.getFullYear()+'-'+this.addzero(oDate.getMonth()+1)+'-'+this.addzero(oDate.getDate())+' '+this.addzero(hours)+':'+this.addzero(oDate.getMinutes());
        }

        return str;
    },
    datetotime:function(dateStr){//时间格式转时间戳
        if (dateStr.indexOf('.')!=-1) {
        dateStr.substring(0,dateStr.indexOf('.'));
        }
        var newstr = dateStr.replace(/-/g,'/');
        var date =  new Date(newstr);
        var time_str = date.getTime().toString();
        return time_str.substr(0,10);
    },
    comparenowtime:function(timestr){//比较当点时间与某个时间先后
        timestr=this.datetotime(timestr)//待比较的某个时间
        var nowtimestr=new Date().getTime().toString().substr(0,10)
        if(timestr<nowtimestr){
            return 'past'
        }else{
            return 'future'
        }
    },
    addzero:function(n) {
        return n<10?"0"+n:n;
    },
    timelistsort:function(arr,reversesort){//2017-10-05 08:00:00格式时间数组排序，reversesort表示从大到小排
        var sortedarr=[]
        if(!reversesort){//默认从小到大排
            sortedarr=arr.sort(function(a,b){
                return Date.parse(new Date(a.starttime))-Date.parse(new Date(b.starttime))
            })
        }else{//从小到大排
            sortedarr=arr.sort(function(a,b){
                return Date.parse(new Date(b.starttime))-Date.parse(new Date(a.starttime))
            })
        }
        return sortedarr
    }
};
export default xiefn
