function errcodefn(res){//公用错误码函数
    if(res.errcode==3106){
        layer.msg("登录信息已失效，请重新登录");
        setTimeout(function(){
            window.top.location.href="login.html"
        },3000)
    }else if( res.errcode == 3108 ){
        layer.msg("请输入正确格式的邮箱！");
    }
    else{
        layer.msg(res.errdesc);
    }
};
function errfn(){//公用连接失败函数
    layer.msg("连接服务失败")
};

function open_dialog1(opt){//打开yesorno对话框
	$('body').append(//生成yesorno对话框
		'<div class="yes-no-dialog yes-no-dialog1">'+
			'<h3>标题</h3>'+
			'<p></p>'+
			'<div class="btn_con clearfix">'+
				'<button class="yes_btn">确定</button>'+
				'<button class="no_btn">取消</button>'+
			'</div>'+
		'</div>'
	);

	opt.title = opt.title || '';
	opt.content = opt.content || '';
	opt.yesbtnname = opt.yesbtnname || '确定';
	$('.yes-no-dialog1 h3').html(opt.title);
	$('.yes-no-dialog1 p').html(opt.content);
	$('.yes-no-dialog1 .yes_btn').html(opt.yesbtnname);
	layer.open({
		type: 1,
		closeBtn: 0,
		shade:'transparent',
		title:false,
		area: 'auto',
		maxWidth:'700px',
		move:'.yes-no-dialog h3',
		skin: 'layui-layer-nobg', //没有背景色
		shadeClose: false,
		content: $('.yes-no-dialog1'),
		success: function(layero, index){
			$('.yes-no-dialog1 .no_btn').one('click',function() {
				layer.close(index);
				$('.yes-no-dialog1').remove();
			});
			$('.yes-no-dialog1 .yes_btn').one('click',function() {
				opt.yes();
				layer.close(index);
				$('.yes-no-dialog1').remove();
			});
		}
	});
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
                shade: 'transparent'
            });
        }

        // options.url = 'http://106.15.61.55:18085/misrobot-service'+options.url;
        options.url = 'http://192.168.0.90:8085'+options.url;
        var data=JSON.stringify({ "1":options.data });
        var req=new XMLHttpRequest();
        req.open('POST',options.url);
        req.setRequestHeader("content-Type","application/json;charset=utf-8");
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

var shade = {//生成遮罩的方法
    shadeOpen:function(){
        $('body').append('<div class="myshade" style="width:100%;'+
            'height:100%; background-color:rgba(0,0,0,0.3); position:fixed;'
            +'z-index:15; top:0; left:0;"></div>');
    },
    shadeClose:function(){
        $('.myshade').remove();
    }
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

    
};
function setCookieIOS(name,value) {//苹果手机setCookie方法
    document.cookie=name+"="+encodeURIComponent(value);
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

function my_checkbox_change(){//封装的多选框改变样式(放在mounted和updated里面)
	$('.user-defined-checkbox').each(function(index, el) {
		if( $(this).children('input')[0].checked ){
			$(this).addClass('user-defined-checkbox-on');
		}else{
			$(this).removeClass('user-defined-checkbox-on');
		}
	});
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

//时间戳转时间格式2016-05-01 12:01:12
function timetodate(num,n) {
    var oDate = new Date();
    oDate.setTime(num);
    var hours = oDate.getHours();
    if (n=='1') {
        var str = oDate.getFullYear()+'-'+addzero(oDate.getMonth()+1)+'-'+addzero(oDate.getDate());
    } else if (n=='2') {//xx:xx
        var str = addzero(oDate.getHours())+':'+addzero(oDate.getMinutes());
    } else if (n=='3') {//xx-xx xx:xx
        var str = addzero(oDate.getMonth()+1)+'-'+addzero(oDate.getDate())+' '+addzero(hours)+':'+addzero(oDate.getMinutes());
    } else if (n=='4') {//xxxx-xx-xx
        var str = oDate.getFullYear()+'-'+addzero(oDate.getMonth()+1)+'-'+addzero(oDate.getDate());
    } else if (n=='5') {
        var str = (oDate.getMonth()+1)+'月';
    } else if (n=='6') {
        var str = (oDate.getMonth()+1)+'月'+addzero(oDate.getDate())+'日'+' '+addzero(hours)+':'+addzero(oDate.getMinutes());
    } else if (n=='7') {//xxxx.xx.xx
        var str = oDate.getFullYear()+'.'+addzero(oDate.getMonth()+1)+'.'+addzero(oDate.getDate());
    } else if (n=='8') {//xx-xx
        var str = addzero(oDate.getMonth()+1)+'-'+addzero(oDate.getDate());
    } else if (n=='9') {//xxxx年xx月
        var str = oDate.getFullYear()+'年'+addzero(oDate.getMonth()+1)+'月';
    } else if (n=='10'){//xxxx-xx
        var str = oDate.getFullYear()+'-'+addzero(oDate.getMonth()+1);
    } else {//xxxx-xx-xx xx:xx
        var str = oDate.getFullYear()+'-'+addzero(oDate.getMonth()+1)+'-'+addzero(oDate.getDate())+' '+addzero(hours)+':'+addzero(oDate.getMinutes());
    }

    return str;
}

//给小于10的加0
function addzero(n) {
    return n<10?"0"+n:n;
};

//字符转编码
function strtocode(str) {
    var _arr = str.split("");
    var _arr2 = [];
    for (var i = 0; i<_arr.length; i++) {
        _arr2.push(_arr[i].charCodeAt());
    }
    var _str2 = _arr2.join("&");
    return _str2;
};

//编码转字符
function codetostr(str) {
    var arr = str.split("&");
    var _arr = [];
    for (var i = 0 ; i <arr.length; i++) {
        _arr.push(String.fromCharCode(arr[i]));
    }
    var _str = _arr.join("");
    return _str;
};