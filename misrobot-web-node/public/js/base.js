'use strict';

/**
 * 公用ajax方法
 * 调用方法
 * Api.xxx({
 * 		isrepeat:$()  触发事件的元素     验证重复提交
 * 		istoken:1             是否需要验证token
 * 		islaravel:1        是否需要将参数都放在url后面传递
 * 		isShade:1    	 是否显示转圈圈那个等待匡
 * 		json:{}       参数
 * 		fn:function   成功之后的回调函数
 * })
 */
var Api = {

    url:'',
    // url:'http://192.168.1.200:28086',
    perpage:10,
    R:function (options) {
        options.json = options.json||{};
        if (!options.istoken) {
            if (getCookie("gy_t")) {
            } else {
                if(window.location.href.indexOf('/ostp/') != -1){//是在线训练平台就跳在线训练的登录页面
                    jumplogin();
                }
                return false;
            }
        }
        if (options.isShade) {
            Api.shade = layer.load(1, {
                shade: [0.3,'#000'] //0.1透明度的白色背景
            });

        }

        $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: Api.url + options.url,
            data: JSON.stringify(options.json),
            success:function (str) {
                layer.close(Api.shade);
                if (options.isrepeat) {
                    var obj = $(options.isrepeat)[0];
                    obj.bWait=false;
                }
                var base;
                if (typeof(str)=='string') {
                    if( str.length > 0 ){
                        if (str[0]=='"'&&str[str.length-1]=='"') {
                            // options.fn&&options.fn(eval('('+str.substring(1,str.length-1)+')'));
                            base = eval('('+str.substring(1,str.length-1)+')');
                        } else {
                            // options.fn&&options.fn(eval('('+str+')'));
                            base = eval('('+str+')');
                        }
                    }else{
                        console.log(options.url+'出参为空');
                        return false;
                    }
                    

                } else {
                    // options.fn&&options.fn(str);
                    base = str;
                }
                if( base[1].errcode!= 0 ){
                    if( base[1].errcode == 9904 ){//sessionid失效
                        if(window.location.href.indexOf('/ostp/') != -1){//是在线训练平台就跳在线训练的登录页面
                            uselayer(1,'sessionid失效,请重新登录!',function(){
                                jumplogin();
                            });
                        }else if( window.location.href.indexOf('/istudy/')!= -1 ){
                            logoutquick();
                                
                        }else{
                            uselayer(1,'sessionid失效,请重新登录!');
                        }
                        
                        return false;
                    }
                    // uselayer(3,base[1].errdesc);//接口报错
                    // return false;
                }
                options.fn&&options.fn(base);//成功
                

            },
            error:function (json) {
                layer.close(Api.shade);
                if (options.isrepeat) {
                    obj.bWait=false;
                }
                if (options.error) {
                    options.error(json);
                    return false;
                }
                console.log(json);
                if (json.status==401) {
                    if(window.location.href.indexOf('/ostp/') != -1){//是在线训练平台就跳在线训练的登录页面
                        jumplogin();
                    }
                } else if (json.status==500) {
                    alert("服务器内部错误，请稍后再试。");
                } else {
                    var _txt = eval('('+json.responseText+')');
                    alert(_txt.error);
                }
            }
        });
    },

    //刘继华接口
    dataToJava:function (a) {
        var url = a.json.url;
        delete a.json.url;
        // Api.R(a,'/p/' + url, 'post');

        $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: '../p/' + url,
            data: a.json.data,
            success:function (str) {
                layer.close(1);

                if (typeof(str)=='string') {
                    if (str[0]=='"'&&str[str.length-1]=='"') {
                        a.fn&&a.fn(eval('('+str.substring(1,str.length-1)+')'));
                    } else {
                        a.fn&&a.fn(eval('('+str+')'));
                    }

                } else {
                    a.fn&&a.fn(str);
                }
            },
            error:function (json) {
                layer.close(1);

                if (a.error) {
                    a.error(json);
                    return false;
                }

                if (json.status==401) {
                    jumplogin();
                } else if (json.status==500) {
                    alert("服务器内部错误，请稍后再试。");
                } else {
                    var _txt = eval('('+json.responseText+')');
                    alert(_txt.error);
                }
            }
        });
    }  //刘继华接口
};


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
};
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
};
//删除cookie
function removeCookie(name) {
    setCookie(name,"",-1);
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

//输入框聚焦时提示文字消失
function inputfocus	(id) {
    var oSign = id;
    if (typeof id == "string") {
        oSign = document.getElementById(id);
    }
    var aText = oSign.getElementsByTagName('input');
    var aSpan = oSign.getElementsByTagName('span');
    for (var i = 0 ; i < aText.length; i++) {
        aText[i].index = i;
        aSpan[i].index = i;
        aText[i].onfocus = function () {
            aSpan[this.index].style.display = "none";
        };
        aText[i].onblur = function(){
            if(this.value == ""){
                aSpan[this.index].style.display = "block";
            }
        };
        aSpan[i].onclick = function(){
            aText[this.index].focus();
        };
    }
};

//获取url参数
function GetQueryString(name) {//获取url参数值
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
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
};

function findurltype(name) {
    var str = window.location.href;
    var i = str.indexOf("#");
    if (i!=-1) {
        str = str.substring(i+1,str.length);
        var arr = str.split("&");
        for (var i = 0 ; i <arr.length; i++) {
            var _arr = arr[i].split("=");
            if (_arr[0]==name) {
                return  _arr[1];
            }
        }
    }
    return "";
};


//改变url后面#的值
function changepage(str) {
    var _href = window.location.href;
    if (_href.indexOf('#')==-1) {
        window.location.href = _href+'#'+str;
    } else {
        window.location.href = _href.substring(0,_href.indexOf('#'))+'#'+str;
    }
};

function isIELower() {
    var str = window.navigator.userAgent.toLowerCase();
    if (str.indexOf("msie 9") !=-1||str.indexOf("msie 8") !=-1||str.indexOf("msie 7") !=-1||str.indexOf("msie 6") !=-1) {
        return true;
    } else {
        return false;
    }
};

//给小于10的加0
function addzero(n) {
    return n<10?"0"+n:n;
};


function getstrongid(id) {
    var oDiv = id;
    if (typeof id == "string") {
        oDiv = document.getElementById(id);
    }
    var oStrong = oDiv.getElementsByTagName("strong")[0];
    return oStrong.indexid;
};

function getstronghtml(id) {
    var oDiv = id;
    if (typeof id == "string") {
        oDiv = document.getElementById(id);
    }
    var oStrong = oDiv.getElementsByTagName("strong")[0];
    return oStrong.innerHTML;
};

//时间戳转时间格式2016-05-01 12:01:12
function timetodate(num,n) {
    var oDate = new Date();
    oDate.setTime(num*1000);
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
};

//时间格式转时间戳
function datetotime(dateStr){
    if (dateStr.indexOf('.')!=-1) {
        dateStr.substring(0,dateStr.indexOf('.'));
    }
    var newstr = dateStr.replace(/-/g,'/');
    var date =  new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str.substr(0,10);
};

//写自定义下拉
function writeselect(options) {
    options = options||{};
    var oDiv = options.obj;
    var arr = options.arr;
    var all = options.all;

    if (typeof obj == "string") {
        oDiv = document.getElementById(obj);
    }
    var oSpan = oDiv.getElementsByTagName("span")[0];
    var oStrong = oSpan.getElementsByTagName("strong")[0];
    var oI = oSpan.getElementsByTagName("i")[0];

    var oUl = oDiv.getElementsByTagName("ul")[0];
    if (all=='all') {
        oStrong.innerHTML = "全部";
        oStrong.indexid = 0;
        oUl.innerHTML = "<li>全部</li>";
        oUl.getElementsByTagName("li")[0].indexid = 0;
    } else {
        oStrong.innerHTML = arr[0].name;
        oStrong.indexid = arr[0].id;
        oUl.innerHTML = "";
    }

    for (var i = 0 ; i < arr.length; i++) {
        var oLi = document.createElement("li");
        oLi.innerHTML = arr[i].name;
        oLi.indexid = arr[i].id;
        oUl.appendChild(oLi);
    }
    oSpan.bClick = false;
    oSpan.onclick = function () {
        if (oSpan.bClick) {
            oUl.style.display = "none";
            oSpan.className = '';
            oSpan.bClick = false;
        } else {
            oUl.style.display = "block";
            oSpan.className = 'active';
            oSpan.bClick = true;
        }
    };
    oUl.onclick = function(ev){
        var oEvent = ev || event;
        var oSrc = oEvent.srcElement || oEvent.target;
        if(oSrc.tagName.toLowerCase() == "li"){
            oStrong.innerHTML = oSrc.innerHTML;
            oStrong.indexid = oSrc.indexid;
            oUl.style.display = "none";
            oSpan.className = '';
            oSpan.bClick = false;
            options.fn&&options.fn(oSrc.indexid);
        }
    };
    options.fn&&options.fn(arr[0].id);
};

//分页
function flipover(total,prepage,fn,obj) {
    var oPage = document.getElementById("mypage");
    if (total==0) {
        obj.innerHTML = '<p class="no-data">该条件下暂无数据<p>';
        oPage.style.display = "none";
        return false;
    } else {
        obj.innerHTML = '';
    }
    if (obj.showpage) {
        return false;
    }
    if (total<=prepage) {
        oPage.style.display = "none";
        return false;
    }

    obj.showpage = true;

    if (oPage.innerHTML=='') {
        oPage.innerHTML =
            '<input type="button" value="首页" class="page_first" />'
            +'<input type="button" value="上一页" class="page_prev" />'
            +'<input type="button" value="..." class="page_jump_prev" />'
            +'<div><ul class="clearfix page_list"></ul></div>'
            +'<input type="button" value="..." class="page_jump_next" />'
            +'<input type="button" value="下一页" class="page_next" />'
            +'<input type="button" value="末页" class="page_last" />';
    }
    var oUl = oPage.getElementsByTagName("ul")[0];
    var oFirst = $(oPage).find('.page_first')[0];
    var oLast = $(oPage).find('.page_last')[0];
    var oPrev = $(oPage).find('.page_prev')[0];
    var oNext = $(oPage).find('.page_next')[0];
    var oJumpPrev = $(oPage).find('.page_jump_prev')[0];
    var oJumpNext = $(oPage).find('.page_jump_next')[0];
    var iLeft = 0;
    var iW = 42;
    var iNum = 0 ;
    var iNow = 0;

    oUl.innerHTML = '';
    oUl.style.left = 0;
    oJumpPrev.style.visibility = "hidden";
    oJumpNext.style.visibility = "hidden";
    oUl.style.width = total*iW+"px";
    var nPage = Math.ceil(total/prepage);
    for (var i = 0 ; i < nPage; i++) {
        var oLi = document.createElement("li");
        oLi.innerHTML = i+1;
        oUl.appendChild(oLi);
        if (i==0) {
            oLi.className = "active";
        }
    }
    var aLi = oUl.getElementsByTagName("li");
    aLi[aLi.length-1].style.borderRight = '1px solid #ddd';
    if (nPage>5) {
        oFirst.style.visibility = "visible";
        oLast.style.visibility = "visible";
        oPrev.style.visibility = "visible";
        oNext.style.visibility = "visible";
//		oJumpPrev.style.visibility = "visible";
        oJumpNext.style.visibility = "visible";
        oJumpNext.style.visibility = "visible";
//		$(oFirst,oLast).attr('disabled','disabled');


        oJumpNext.onclick = function () {
            iNow+=5;
            if (iNow > aLi.length-1) {
                iNow = aLi.length-1;
            }
            tab();
        };
    } else {
        oFirst.style.visibility = "hidden";
        oLast.style.visibility = "hidden";
        oPrev.style.visibility = "hidden";
        oNext.style.visibility = "hidden";
        oJumpPrev.style.visibility = "hidden";
        oJumpNext.style.visibility = "hidden";
    }
    oJumpPrev.onclick = function () {
        iNow-=5;
        if (iNow <0) {
            iNow = 0;
        }
        tab();
    };
    oFirst.onclick = function () {
        iNow = 0;
        tab();
    };
    oLast.onclick = function () {
        iNow = aLi.length-1;
        tab();
    };
    for (var i = 0 ; i < aLi.length; i++) {
        aLi[i].index = i;
        aLi[i].onclick = function () {
            iNow = this.index;
            tab();
        }
    }
    oNext.onclick = function () {
        iNow++;
        if(iNow == aLi.length) {
            iNow = aLi.length-1;
        }
        tab();
    };
    oPrev.onclick = function () {
        iNow--;
        if(iNow <0) {
            iNow=0;
        }
        tab();
    };
    function tab() {
        if (iNow<3) {
            oJumpPrev.style.visibility = "hidden";
        } else {
            if (nPage>5) {
                oJumpPrev.style.visibility = "visible";
            }
        }
        if (iNow>aLi.length-4) {
            oJumpNext.style.visibility = "hidden";
        } else {
            if (nPage>5) {
                oJumpNext.style.visibility = "visible";
            }
        }
        iLeft = (-iNow+2)*iW;
        if (iLeft<-(aLi.length-5)*iW) {
            iLeft=-(aLi.length-5)*iW;
        }
        if (iLeft>0) {
            iLeft=0;
        }
        for ( var i=0;i<aLi.length;i++) {
            aLi[i].className = '';
        }
        obj.page = aLi[iNow].innerHTML;
        fn&&fn();
        aLi[iNow].className = 'active';
        $(oUl).stop().animate({"left":iLeft},{duration: 200});
    };
    oPage.style.display = 'block';
};

//html5 文件上传
function uploadFile(options) {
    var index = layer.load(1, {
        shade: [0.3,'#000'] //0.1透明度的白色背景
    });
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", options.url);
    xhr.send(JSON.stringify(options.json));

    function uploadProgress(evt) {
        console.log(evt);
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            //    $(".progress span").html(percentComplete.toString() + '%');
        }
        else {

        }
    }
    function uploadComplete(evt) {
        /*上传完成后执行函数*/
        layer.close(index);
        options.success&&options.success(evt.target.responseText);

    };
    function uploadFailed(evt) {
        layer.close(index);
        alert("文件上传出错，请刷新重试");
    };
    function uploadCanceled(evt) {
        layer.close(index);
        alert("上传超时，请刷新重试。");
    };
};

function toupload(obj,url) {
    obj.onchange = function () {
        layer.msg('正在导入，请耐心等待导入完成');
        uploadFile({
            url:Api.url+url+'?access_token='+getCookie("gy_t"),
            json:{
                'access_token':getCookie("gy_t"),
                "file":$(this)[0].files[0]
            },
            success:function (str) {
                var json = eval('('+str+')');
                if (json.status==1) {
                    uselayer(1,json.message,function () {
                        window.location.reload();
                    });
                }
            }
        });
    };
};

function uselayer(type,str,fn,fn2) {
    if (type=='1') {
        var ilayer = layer.alert(
            str,
            {btn:['确定']},
            function () {
                layer.close(ilayer);
                fn&&fn();
            });
    } else if (type=='2') {
        var ilayer = layer.confirm(
            str,
            {btn:['确定','取消']},
            function () {
                layer.close(ilayer);
                fn&&fn();
            },
            function () {
                layer.close(ilayer);
                fn2&&fn2();
            }
        );
    } else if (type=='3') {
        var ilayer = layer.msg(str,{
            //time: 100000 //1秒关闭（如果不配置，默认是3秒）
        }, function(){
            fn&&fn();
        });

    } else if (type=='4') {
        var ilayer = layer.alert(
            str,
            {btn:['确定']},
            function () {
                layer.close(ilayer);
                fn&&fn();
            });
    }
};

function isnull(str) {
    return str==undefined?'0':str;
}

//公用方法
function common(name) {
    istruelogin();
    if (isIELower()) {
        alert('您的浏览器版本过低，请升级浏览器');
    }

    $('.cancle').click(function () {
        history.go(-1);
    });
    var json = {
        '训练记录':{
            url:'train-record.html',
            class:''
        },
        '我的课表':{
            url:'skill-table.html',
            class:''
        },
        '我的预约':{
            url:'my-subscribe.html',
            class:''
        },
        '我的考试':{
            url:'my-exam.html',
            class:''
        },
        '修改密码':{
            url:'change-pwd.html',
            class:''
        },
        '退出':{
            url:'javascript:;',
            class:'loginOut'
        }
    };
    $('.selectUl').html('');
    for (var name in json) {
        $('.selectUl').append('<li class="selectUlLi"><a href="'+json[name].url+'" class="'+json[name].class+'">'+name+'</a></li>')
    }

    $('.loginOut').click(function () {
        uselayer(2,'确定要退出吗？',function () {
            Api.R({
                url: "/usr/logout",
                isShade: 1,
                json: {
                    "1": {
                        command: "usr/logout",
                        uid: getCookie('gy_u'),
                        sessionid: getCookie('gy_t')
                    }
                },
                fn: function(result) {
                    if( result["1"].errcode != 0 ){
                        uselayer(2,'登出失败! '+result["1"].errdesc);
                        return false;
                    }
                    jumplogin();
                }
            })

        });
    });
    
    $('.userName').html(codetostr(decodeURIComponent(getCookie('gy_n'))));
    $('.headImg').attr('src',decodeURIComponent(getCookie('gy_a')));
    $('.headImg').attr('onerror', 'this.src="../../images/ostp/head2.png"');
    $('.headImg2').attr('onerror', 'this.src="../../images/ostp/head2.png"');
    $('.personImg').attr('onerror', 'this.src="../../images/ostp/head2.png"');
    // $('.gradeYear,.year').html(codetostr(getCookie('gy_g')));
    //是否有新消息
    checkNewMsg();
    $('.headImg,.nameAndYearInner').click(function () {
        window.location.href="my-baseinfo.html"
    });
    $('.bell').click(function() {
         window.location.href = 'see-msg.html';
     });
};

function checkNewMsg(){
    Api.R({
        url: "/note/hasnote",
        istoken:1,
        isShade: 1,
        json: {
            "1": {
                command: "note/hasnote",
                uid: getCookie('gy_u'),
                sessionid: getCookie('gy_t'),
                loginid: getCookie('gy_u')
            }
        },
        fn: function(result) {
            if( result["1"].errcode != 0 ){
                console.log(result["1"].errdesc);
                return;
            }
            if( result["1"].hasnote > 0 ){
                $('.redCircle').attr('style','display:block');
            }else{
                $('.redCircle').attr('style','display:none');
            }
        }
    })
}

//web公用方法
function webcommon() {
    istruelogin();
    $('.return1').click(function () {
        history.go(-1);
    });

};

//微信端公用方法
function wxcommon(web) {

    var evt = "onorientationchange" in window ? "orientationchange" : "resize";

    window.addEventListener(evt, function() {
        console.log("屏幕旋转");
        window.location.reload();
    }, false);


    //判断是否微信浏览器
    if(browser.versions.weixin){

    } else {
        if (web) {
            return false;
        }

        document.write('<div class="page_msg"><div class="inner"><span class="msg_icon_wrp"><i class="icon80_smile"></i></span><div class="msg_content"><h4>请在微信客户端打开链接</h4></div></div></div>');
        document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/connect/zh_CN/htmledition/style/wap_err1a9853.css">';
    }
};



//判断访问终端
var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
};


function istruelogin() {// 请求服务器判断sessionid是否可用，不可用跳登录
    // if (!getCookie('gy_t') || !getCookie('gy_u')) {
    //     return false;
    // }
    // var nowUrl = window.location.href;
    
    // Api.R({
    //     isShade:1,
    //     url: "/usr/sessionidisvalid",
    //     json: {
    //         "1": {
    //             command: "usr/sessionidisvalid",
    //             uid: getCookie('gy_u'),
    //             loginid: getCookie('gy_u'),
    //             sessionid: getCookie('gy_t')
    //         }
    //     },
    //     fn: function(result){
    //         result = result[1];
    //         if(result.errcode != 0) {
    //             uselayer(3, result.errdesc);
    //             if( nowUrl.indexOf('login.html') != -1 ){//如果本来就在登录页面
    //                 return false;
    //             }
    //             window.location.href = 'login.html';
    //         }else{
    //             if( nowUrl.indexOf('login.html') != -1 ){//如果在登录页面跳到index.html
    //                 window.location.href = 'index.html';
    //             }
    //         }
    //     },
    //     error: function(err) {
    //         if( nowUrl.indexOf('login.html') != -1 ){//如果本来就在登录页面
    //             return false;
    //         }
    //         window.location.href = 'login.html';
    //     }
    // });
};

function isComRequire(){
    if (window.navigator.userAgent.toLowerCase().indexOf('chrome')!=-1 || isIELower()==true) {
        uselayer(1,'请使用IE10以上、Firefox或者Opera内核的浏览器打开');
        return false;
    }else{
        return true;
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

function jumplogin() {
    removeCookie('gy_t');
    var _href = window.location.href;
    var _i = _href.lastIndexOf('/');
    window.location.href = _href.substring(0,_i+1)+'login.html';
}

function secondToHourMinSec(sec){//秒数转换成1小时23分钟32秒
    var hour; var minute; var second;
    hour = parseInt(sec/3600);
    sec = sec%3600;
    minute = parseInt(sec/60);
    sec = sec%60;
    second = parseInt(sec);
    var str = '';
    if( hour > 0 ){
        str = hour+'小时'+minute+'分钟'+second+'秒';
    }else if( minute > 0 ){
        str = minute+'分钟'+second+'秒';
    }else{
        str = second+'秒';
    }
    return str;
}

function secondToHourMinSec2(sec){//秒数转换成1:23:32
    var hour; var minute; var second;
    hour = parseInt(sec/3600);
    sec = sec%3600;
    minute = parseInt(sec/60);
    sec = sec%60;
    second = parseInt(sec);
    var str = '';
    if( hour > 0 ){
        str = addzero(hour)+':'+addzero(minute)+':'+addzero(second);
    }else if( minute > 0 ){
        str = addzero(minute)+':'+addzero(second);
    }else{
        str = '00:'+addzero(second);
    }
    return str;
}

//各个指数近6个月趋势
function writegrow(json) {
    console.log(json);
    if (json.errcode!=0) {
        uselayer(1,json.errdesc);
        return false;
    }
    
    $('.littleChartCon,.instrumentPanel,.point').click(function () {
        $('.chart2Tit').html($(this).attr('_title')+'&nbsp;近6个月成长趋势');
        var arr = json[$(this).attr('_type')];
        var _name = [];
        var _value = [];
        for (var i = arr.length-1 ; i >= 0; i--) {
            var time = arr[i].time;
            time = time.split(' ',1)[0];
            
            _name.push(timetodate(datetotime(time),5));
            _value.push(parseFloat(arr[i].value));
        }
        var str = '';
        if (_value.length==0) {
            str = '暂无相关分数';
        } else if (_value.length==1) {
            str = _name[0]+_value[0].toFixed(2)+'分';
        } else {
            if (_value[_value.length-1]>=_value[_value.length-2]) {
                str = (_name[_value.length-1]+(_value[_value.length-1]).toFixed(2))+'分，比上个月增长'+(_value[_value.length-1]-_value[_value.length-2]).toFixed(2)+'分';
            } else {
                str = (_name[_value.length-1]+(_value[_value.length-1]).toFixed(2))+'分，比上个月降低'+(_value[_value.length-2]-_value[_value.length-1]).toFixed(2)+'分';
            }
        }
        $('.txt2').html(str);
        writeline($('.chart2Con')[0],_name,_value,'');
    });
    $('.instrumentPanel').click();
};

//画8个维度的雷达图
function writeability(json,bg) {
    function toPositive(num){//把负数转换成0
        if(num < 0){
            num = 0;
        }
        return num;
    }
    console.log(json);
    if (json.errcode!=0) {
        uselayer(1,json.errdesc);
        return false;
    }
    var arr1 = [
        {text:'病人安全',max:100},
        {text:'无菌观念',max:100},
        {text:'人文关怀',max:100},
        {text:'专业知识',max:100},
        {text:'专业技能',max:100},
        {text:'临床思维',max:100},
        {text:'职业素养',max:100},
        {text:'医患沟通',max:100}
    ];
    var arr2 = [
        toPositive(parseFloat(json.braq)).toFixed(2),
        toPositive(parseFloat(json.wjgn)).toFixed(2),
        toPositive(parseFloat(json.rwgh)).toFixed(2),
        toPositive(parseFloat(json.zyzs)).toFixed(2),
        toPositive(parseFloat(json.zyjn)).toFixed(2),
        toPositive(parseFloat(json.lcsw)).toFixed(2),
        toPositive(parseFloat(json.zysy)).toFixed(2),
        toPositive(parseFloat(json.yhgt)).toFixed(2)
    ];
                
    writeradar({
        obj:$('.writeability')[0],
        name:arr1,
        value:arr2,
        show:true,
        bg:bg?bg:'#eff3f6',
        line:'#0496ca',
        type:'solid',
        color:'rgba(4,150,202,0.2)'
    });

};

function showpersoncenter(type) {
    
    $('.userName').html(codetostr(decodeURIComponent(getCookie('gy_n'))));
    $('.headImg').attr('src',decodeURIComponent(getCookie('gy_a')));
    $('.gradeYear').html(codetostr(getCookie('gy_g')));
        
    $('.leftOuter').html('');
    var json = {
        '个人资料':{
            url:'my-baseinfo.html',
            img:'../../images/ostp/person-center-1'
        },
        '修改密码':{
            url:'change-pwd.html',
            img:'../../images/ostp/person-center-2'
        },
        '查看通知':{
            url:'see-msg.html',
            img:'../../images/ostp/person-center-3'
        },
        '我的预约':{
            url:'my-subscribe.html',
            img:'../../images/ostp/person-center-4'
        },
        '我的考试':{
            url:'my-exam.html',
            img:'../../images/ostp/person-center-4'
        },
        // '已学内容':{
        //     url:'my-homework.html',
        //     img:'../../images/ostp/person-center-5'
        // },
        '训练曲线':{
            url:'train-record.html',
            img:'../../images/ostp/person-center-6'
        },
        // '技能课表':{
        //     url:'skill-table.html',
        //     img:'../../images/ostp/person-center-7'
        // },
        '查看评论':{
            url:'see-evalute.html',
            img:'../../images/ostp/person-center-8'
        }
    };
    for (var name in json) {
        var str =
            '<a href="'+json[name].url+'" class="leftItemCon clearfix '+(type==name?'leftItemConOn':'')+'">'
                +'<div class="blueLine"></div>'
                +'<div class="blueLineTri"></div>'
                +'<div class="leftItem">'
                    +'<img src="'+(type==name?json[name].img+'-on':json[name].img)+'.png" />'
                    +'<span class="leftItemSpan">'+name+'</span>'
                +'</div>'
            +'</a>';
        $('.leftOuter').append(str);
    }
};

function subscribeLayer(txt,func){//取消预约弹出提示框
    $('body').append(
        '<div class="zhezhao">'+
            '<div class="warmOuter">'+
                '<img src="../../images/ostp/closeLayer.png" class="cancel-icon" />'+
                '<h3 class="warm-top">'+
                    '温馨提示'+
                '</h3>'+
                '<img src="../../images/ostp/cancelLayer.png"/>'+
                '<h4>'+
                    txt+
                '</h4>'+
                '<div class="warm-btn-con clearfix">'+
                    '<button class="warm-sure">后悔了</button>'+
                    '<button class="warm-cancel">确定</button>'+
                '</div>'+
            '</div>'+
        '</div>'
    );
    $('.warmOuter>.cancel-icon').click(function() {
        $('.zhezhao').css('display', 'none');
    });

    $('.warm-btn-con>.warm-sure').click(function(event) {
        $('.zhezhao').css('display', 'none');
    });

    $('.warm-btn-con>.warm-cancel').click(function() {
        func();
        $('.zhezhao').css('display', 'none');
    });

}

/*
 *  更新站内信状态
 */
function updatePmStatus(noteid){

    Api.R({
        url: "/note/updstatus",
        isShade:1,
        json: {
            "1": {
                command: "note/updstatus",
                uid: getCookie('gy_u'),
                loginid: getCookie('gy_u'),
                sessionid: getCookie('gy_t'),
                noteid:noteid
            }
        },
        fn: function(result) {
            if( result["1"].errcode == 0 ){
                window.location.reload();
            }
        }
    })
}
