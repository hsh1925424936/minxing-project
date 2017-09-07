var nowWifi='GMC'//要求要连的wifi
var wifiName="";//变量用于保存用户当前的wifi状态,在js第199行校验wifi
var scheduleId=[];//变量用于保存所有查询到的课程id
var scheduleIndex=-1;//现在哪节课可以签到？-1是没有
var courseST=[];//今天所有课程的开始时间字符串
var courseET=[];//今天所有课程的结束时间字符串
var courseSTM=[];//今天所有课程的开始时间转换为分钟数后
var courseETM=[];//今天所有课程的结束时间转换为分钟数后1111
function getTime(){//获取当前年，月，日，周几并赋值给头部日期栏
    var year=time.getFullYear();
    var month=time.getMonth()+1;
    var day=time.getDate();
    var week=time.getDay();
    var weekch="";
    switch(week){
        case 0:
            weekch="周日";
            break;
        case 1:
            weekch="周一";
            break;
        case 2:
            weekch="周二";
            break;
        case 3:
            weekch="周三";
            break;
        case 4:
            weekch="周四";
            break;
        case 5:
            weekch="周五";
            break;
        case 6:
            weekch="周六";
            break;
        default:
            break;
        }
    $("#date").html(weekch+" ( "+year+"."+month+"."+day+" ) ");
};
function postJson(url,json,callback,errorfn){//ajax方法函数
    var sendJson={
        "1":json,
    };
    sendJson=JSON.stringify(sendJson);
    $.ajax({
        type:"POST",
        url:url,
        data:sendJson,
        dataType:"json",
        contentType: "application/json; charset=utf-8",
        success:function(msg){
            if(typeof(msg)=="string"){
                msg=JSON.parse(msg);
            };
            $.each(msg,function(x,y){
                if(x=="1"){
                    if(y.errcode==0){
                        callback(y);
                    }
                    else{
                        errorfn(y);
                    }
                };
            });
        },
        error:function(){
            layer.msg("数据传输出错");
        },
    })
};
function getCookie(name) {//读取cookie方法
    var arr = document.cookie.split("; ");
    for (var i = 0 ; i<arr.length; i++) {
        var _arr = arr[i].split("=");
        if (_arr[0]==name) {
            return _arr[1];
        }
    }
    return "";
};
function setCookie(name,value){//设置cookie的方法
    var cookie=name+"="+value;
    document.cookie=cookie
};
function regTime(str){//把后台2017-01-13 08:00:00时间格式转换成08:00格式
    var newStr=str.slice(11,16);
    return newStr
};
function timeToMinute(str){//把时间08:00的时间格式字符串转换为分钟数
    var min;
    var arr=str.split(":");
    min=parseInt(arr[0])*60+parseInt(arr[1]);
    return min;
};
function logout() {
    if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1){
        window.JavaInterface.JavaScriptLogout(); //callback android OS logout function
    } else{
        // callback ios OS function
        setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('Logout', {}, function responseCallback(responseData) {});
        });
    }
}
function showCourse(){//显示课程信息函数
    if($("#content div").length!=0){//页面中已有旧的课程信息了。如果是点刷新按钮，
        for(var i=0;i<$("#content div").length;i++){
            $("#content div:eq("+i+")").remove()
        }
    }
    var json={
        command:"course/querycourseinfo",
        timetype:1,
        sessionid:getCookie('gy_t'),
        uid:getCookie('gy_u'),
        loginid:getCookie('gy_u')
    };
    function errorfn(obj){
        if(obj.errcode==9904){
            layer.msg("登录信息失效，请重新登录！")
            setTimeout(function(){
                logout()
            },3000)
        } else{
            layer.msg(obj.errdesc)
        }
    };
    postJson("/course/querycourseinfo",json,setCourseMsg,errorfn)
};
function setCourseMsg(obj){//将获取到的课程信息赋值给页面元素
    $("#content").empty();
    if(obj.schedules){//如果今天有课
        $("#content").attr("class","show");//页面显示content块
        $("#noCourse").attr("class","hide");//隐藏noCourse块
        var courseAmount=obj.schedules.length;//获取今天有几节课
        for(var i=0;i<courseAmount;i++){//循环，如果当前时间小于课程结束时间，就生成一个div，把schedules数组内容显示在这个div里，有几节课，就生成几个div.
            scheduleId.push(obj.schedules[i].scheduleid);//把所有课程的scheduleid保存到scheduleId数组
            courseST.push(regTime(obj.schedules[i].starttime));//循环获取各节课的开始时间，保存到courseST数组
            courseET.push(regTime(obj.schedules[i].endtime));//循环获取各节课的结束时间，保存到courseST数组
            courseSTM.push(timeToMinute(courseST[i]));//获得各堂课程开始时间分钟数的数组
            courseETM.push(timeToMinute(courseET[i]));//获得各堂课程结束时间分钟数的数组
            if(obj.schedules[i].issigned==1){//如果循环到这节课已签到
                var contentDiv=$("<div data-issigned="+obj.schedules[i].issigned+" class='courseMsg white'></div>");
                contentDiv.html(
                    "<ul class='courseMsgList'><li class='courseName'><b>"+obj.schedules[i].coursename+"</b> <span class=yellowSign>已签到</span></li><li class='coursePlace'>授课地点："+obj.schedules[i].roomnum+"教室</li><li class='courseTime'>授课时间："+courseST[i]+"-"+courseET[i]+"</li></ul>"
                );
            }
            else{//如果循环到这节课没有签到
                var contentDiv=$("<div data-issigned="+obj.schedules[i].issigned+" class='courseMsg'></div>");
                contentDiv.html(
                    "<ul class='courseMsgList'><li class='courseName'><b>"+obj.schedules[i].coursename+"</b></li><li class='coursePlace'>授课地点："+obj.schedules[i].roomnum+"教室</li><li class='courseTime'>授课时间："+courseST[i]+"-"+courseET[i]+"</li></ul>"
                );
            }
            $("#content").append(contentDiv);
            if(nowMinutes<courseETM[i]){//页面中只展示当前时间没有结束的课程
                $(".courseMsg:eq("+i+")").addClass("show");
            }
            else{
                $(".courseMsg:eq("+i+")").addClass("hide");
            }
        };//循环结束，课程信息已展示在content块中。
        isCourseNow();//获取到当天的课程信息后，马上查一次现在有没有课可以签到
    }
    else{//如果今天没有课，就显示noCourse块
        $("#content").attr("class","hide");
        $("#noCourse").attr("class","show");
    }
    if($("#content div.courseMsg.show").length==0){//如果今天有课
        $("#content").attr("class","hide");
        $("#noCourse").attr("class","show");
    }
};
function isCourseNow() {//方法用来判断，现在时间哪堂课可以签到了,如果在签到时间，就显示蓝色的签到按钮
    for (var i = 0; i < courseSTM.length; i++) {
        if ((courseSTM[i] - 10 < nowMinutes) && (nowMinutes < courseETM[i])) {
            scheduleIndex = i;
            break;
        }
        else{
            scheduleIndex=-1;
        }
    };
    if(scheduleIndex!=-1){
        var scheduleid=scheduleId[scheduleIndex];
        $(".courseMsg:eq("+scheduleIndex+")").css({"backgroundColor":"white"});
        if($(".courseMsg:eq("+scheduleIndex+") p").length==0&&$(".courseMsg:eq("+scheduleIndex+") span").length==0){//如果这节课没有被签到就添加一个签到按钮
            $(".courseMsg:eq("+scheduleIndex+")").append("<p class='blueSign' onclick='qiandao(this)'>签到</p>");
        };
    }
    else{//如果当前没有课程在签到时间范围，显示灰色contentdiv
        $(".courseMsg").css({"backgroundColor":"#F2F2F2"});
        if($(".courseMsg p").length!=0){$(".courseMsg p").remove()};
        if($(".courseMsg span").length!=0){$(".courseMsg span").remove()};
    }
};
function qiandao (elem) {//点击签到后先判断GMC网络，然后用ajax请求后台是否可以签到，最后显示已签到黄色图标。
    if(wifiName!=nowWifi){
        layer.msg("请连接指定网络");
        return
    };
    var json={
        command:"sign/signin",
        loginid:userid,
        uid:userid,
        sessionid:sessionid,
        scheduleid:scheduleId[scheduleIndex]
    };
    function agreeSign(response){//签到请求成功后的回调函数。
        $(elem).parent("div").children("ul").children("li.courseName").append("<span class='yellowSign'>已签到</span>");
        $(elem).remove();
    };
    function errorfn(response){
        if(response.errcode==9904){
            layer.msg("登录信息失效，请重新登录！");
            setTimeout(function(){
                logout()
            },3000)
        } else{
            layer.msg(response.errdesc)
        }
    };
    //签到接口
    //输入参数：command:sign/signin,loginid,sessionid,uid,scheduleid
    postJson("/sign/signin",json,agreeSign,errorfn);
    //}
};




