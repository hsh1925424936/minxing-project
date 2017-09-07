var devID="";
$("#ok,#cha").click(function(){//点击关闭shadow层
    $("#shadow,#shadowErrorBox").attr("class","hide");
});
function guid(len, radix) {//获取uniqueid
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};
var requestQuestions={//查询题目接口需要提供的参数
    command:"examtopic/topiclist",
    examid:"",//需要ajax获取
    stationid:""//需要ajax获取
};
var sendAnswers={//提交答案接口需要提供的参数
    command:"score/submitobjscore",
    uniqueid:guid(30,16),//通过算法，获取uniqueid
    examid:"",//需要ajax获取
    roomid:"",//需要ajax获取
    stationid:"",//需要ajax获取
    examineeid:"",//小队id,需要ajax获取
    examinerid:-1,
    status:"1",
    begintime:"",
    endtime:"",
    answeritems:[]
};
//提交答案接口输入参数
   // command	为方法中去掉POST和之后的空格
   // uniqueid	唯一id，字符串，可以用设备id＋当前时间，最长31字节,需要获取设备id，
//examid	考试id
//roomid	房间id
//stationid	考站id
//examineeid	考生id（小队）
//status	状态：0-无效，1-有效，2-历史，客观题只填1
//begintime	答题开始时间
//endtime	答题结束时间
//****answeritems	[答案项数组]questionid:客观题编号/questionanswer:客观题回答，对于多选答案，用”@”作为分隔符/questionanswertime:回答时间
//提交答案接口输出参数
//command
//errcode
//errdesc
//****scoreid
function getTimeStr(){//2016-01-01 00:00:00数据时间格式
    var time=new Date();
    var timeRule={
        year:time.getFullYear(),
        month:function(){
            return (time.getMonth()+1).toString().length==1? "0"+(time.getMonth()+1):time.getMonth()+1
        },
        day:function(){
            return time.getDate().toString().length==1? "0"+time.getDate():time.getDate()
        },
        hour:function(){
            return time.getHours().toString().length==1? "0"+time.getHours():time.getHours()
        },
        min:function(){
            return time.getMinutes().toString().length==1? "0"+time.getMinutes():time.getMinutes()
        },
        second:function(){
            return time.getSeconds().toString().length==1? "0"+time.getSeconds():time.getSeconds()
        },
        getStr:function(){
            return this.year+"-"+this.month()+"-"+this.day()+" "+this.hour()+":"+this.min()+":"+this.second()
        }
    };
    return timeRule.getStr();
};
function submitOk(){//提交答案成功后跳转页面
    window.location.href="testConfirm.html?x=haha&&name="+resultArr[1];
};
function submiterrorfn(obj){//提交答案可以连接服务，但errcode不等于0
    $("#shadow,#shadowErrorBox").attr("class","show");
    $("#confirmBox").attr("class","hide");
};
function submitFalse(){//提交答案连接服务失败
    $("#shadow,#shadowErrorBox").attr("class","show");
    $("#confirmBox").attr("class","hide");
};
function showQuestions(obj){//从后台查询到题目后显示到页面的函数,参数obj为后台返回的题目信息
    for(var i=0;i<obj.topiclist.length;i++){//循环题目信息数组
        if(obj.topiclist[i].qtype==1){//如果是单选，这次考试只有单选
            if(obj.topiclist[i].imageurl.length!=0){
                $("#questions").append("<li data-time='' data-type='option' data-id="+obj.topiclist[i].qid+"><div>"+obj.topiclist[i].genintroduction+"</div><p>"+(i+1)+" . "+obj.topiclist[i].title+"</p><img src="+obj.topiclist[i].imageurl+" alt=''><ul class='choice'></ul></li>");
            }
            else{
                $("#questions").append("<li data-time='' data-type='option' data-id="+obj.topiclist[i].qid+"><div>"+obj.topiclist[i].genintroduction+"</div><p>"+(i+1)+" . "+obj.topiclist[i].title+"</p><ul class='choice'></ul></li>");
            }
            for(var j=0;j<obj.topiclist[i].itemlist.length;j++){//遍历第i题的选项
                $("#questions>li:eq("+i+")").children("ul.choice").append("<li><i class='optno'></i><span>"+obj.topiclist[i].itemlist[j].itemname+" . "+obj.topiclist[i].itemlist[j].itemcontent+"</span></li>")
            }
        }
    };
    $("ul.choice").on("click","li",function(){//点击选择选项
        var answerTime=getTimeStr();
        if($(this).parents("li").data("type")=="multiple"){//如果是多选题
            $(this).children("b").toggleClass("mulyes");
        }
        else{
            $(this).parent("ul.choice").children("li").children("i").attr("class","optno");
            $(this).children("i").addClass("optyes");
            $(this).parent("ul.choice").parent("li").data("time",answerTime);
        }
        $(this).parent("ul.choice").children("li.notFinishedMsg").remove();
    });
};
function getQuestionsError(obj){//查询题目errcode!=0
    $("#errorBox").html(obj.errdesc);
};
function connectError(){//查询题目连接服务失败
    $("#errorBox").html("连接服务器失败");
};
function getAllParams(){//device/query接口，获取examid,stationid
    var json={
        command:"device/query",
        deviceid:devID,
    };
    function query(obj){//成功后的回调，获取examid,stationid并赋值给后面的接口需要输入的参数
        requestQuestions.stationid=obj.stationid;
        requestQuestions.examid=obj.examid;
        $("#params").html("剩余时间:"+resultArr[3]);
        sendAnswers.stationid=obj.stationid;
        sendAnswers.examid=obj.examid;
        sendAnswers.roomid=obj.roomid;
        //可以在这里加一个接口/schedule/tjtc/queryteamstatus，来查询lefttime,并启动自动提交功能
        postJson("/examtopic/topiclist",requestQuestions,showQuestions,getQuestionsError,connectError);//查到examid,stationid后，再查题目
    };
    function errorDesc(obj1){//获取examid,stationid失败，errcode!=0
        $("#errorMsgBox").html(obj1.errdesc);
    };
    function errConnect(){//连接服务失败
        $("#errorMsgBox").html("连接服务器失败");
    };
    postJson("/device/query",json,query,errorDesc,errConnect);
    //返回参数：roomid,roomname,stationid,stationname,examid,examname,status//房间状态
};
function getAnswerMsg(){//获取考生答题总信息，（题号及对应的考生选的答案）
    //向后台提交答案的格式answeritems:[{
        //questionid:"",
        //questionanswer:"",
       // questionanswertime:"",
    //}],
    for(var i=0;i<$("#questions>li").length;i++){//循环题干
        if($("#questions>li:eq("+i+")").data("type")=="multiple"){//如果循环到当前题是多选题
           var answer="";//某一道题的学生选择答案字符串
           for(var j=0;j<$("#questions>li:eq("+i+")>ul>li").length;j++){//循环本多选题中所有的选择项
                if($("#questions>li:eq("+i+")>ul>li:eq("+j+")").children("b").hasClass("mulyes")){
                    answer+=$("#questions>li:eq("+i+")>ul>li:eq("+j+")").children("span").html().slice(0,1);
                }
           };
            answerArr.push({//将题号和对应的答案保存到answerArr数组
                questionNum:i+1,
                answer:answer,
            })
        }
        else{//循环到当前的是单选题
            //answer1是某一道单选题的答案字符串
            if($("#questions>li:eq("+i+")>ul>li>i.optyes").length!=0){
                var answer1=$("#questions>li:eq("+i+")>ul>li>i.optyes").parent("li").children("span").html().slice(0,1);
                sendAnswers.answeritems.push({//将题号和对应的答案保存到answerArr数组
                    questionid:$("#questions>li:eq("+i+")").data("id"),
                    questionanswer:answer1,
                    questionanswertime:$("#questions>li:eq("+i+")").data("time")
                })
            }
            else{
                var answer2="-";
                sendAnswers.answeritems.push({//将题号和对应的答案保存到answerArr数组
                    questionid:$("#questions>li:eq("+i+")").data("id"),
                    questionanswer:answer2,
                    questionanswertime:getTimeStr()
                })
            }
        }
    }
};
function autoSubmit(){//考试开始后8分钟自动提交成绩
    var submit=setInterval(function(){
        resultArr[3]=parseInt(resultArr[3])-1;
        $("#leftTime").html(resultArr[3]);
        if(resultArr[3]<=0){
            clearInterval(submit);
            submit=null;
            sendAnswers.endtime=getTimeStr();
            getAnswerMsg();
            postJson("/score/submitobjscore",sendAnswers,submitOk,submiterrorfn,submitFalse);
        }
    },1000);
};
var answerArr=[];//题号及对应的答案数组
var isAllChoosed=0;//有漏选为-1，已全选为0；
$("#requestSubmit").click(function(){//点击提交，先判断是否所有题都选了答案,然后把考试数据发到后台，发送成功后在再跳转到成功页面。
    sendAnswers.endtime=getTimeStr();//制定考试结束时间
    isAllChoosed=0;
    for(var i=0;i<$("#questions>li").length;i++){
        if($("#questions>li:eq("+i+")").data("type")=="multiple"){//如果循环到当前题是多选题
            if($("#questions>li:eq("+i+") ul li b.mulyes").length==0){//并且当前题的选项中没有.mulyes
                if($("#questions>li:eq("+i+") ul.choice li.notFinishedMsg").length==0){//并且当前题的选项中没有红色的“请选择一个选项”（如果已有错误提示，就不重复增加了）
                    $("#questions>li:eq("+i+") ul.choice").prepend("<li class='notFinishedMsg'>请选择一个选项</li>");
                }
                isAllChoosed=-1;
            }
        }
        else{//循环到当前的是单选题
            if($("#questions>li:eq("+i+") ul li i.optyes").length==0){//并且当前题的选项中没有.optyes
                if($("#questions>li:eq("+i+") ul.choice li.notFinishedMsg").length==0){//并且当前题的选项中没有红色的“请选择一个选项”（如果已有错误提示，就不重复增加了）
                    $("#questions>li:eq("+i+") ul.choice").prepend("<li class='notFinishedMsg'>请选择一个选项</li>");
                }
                isAllChoosed=-1;
            }
        }
    };
    if(isAllChoosed==0){//有漏选为-1，已全选为0；
        $("#shadow,#confirmBox").attr("class","show");
    }
    else{
        $("li.notFinishedMsg").first().attr("id","firstNotChoosed");
        var top=$("#firstNotChoosed").offset().top;
        $("html,body").animate({scrollTop:(top-44)},500);
    }
});
function cancelSubmit(){//出现提交界面后点击取消，回去继续做题
    $("#shadow,#confirmBox").attr("class","hide");
    $("#confirmBox>p.errorMsg>span").html("");
};
function confirmSubmit(){//点右下角提交按钮，进入提交提示界面
    getAnswerMsg();
    postJson("/score/submitobjscore",sendAnswers,submitOk,submiterrorfn,submitFalse);
}