//MQ消息响应路由全局对象，key-value
//key：基于MQ响应的json格式的对象
//value：回调函数
//Function:接收MQ消息
//Tips：  1. MQ消息是广播模式，模块自己判断是否需要处理广播消息。
//2. 判断原则：编号+roomid/deviceid/或者其他，只要有值就要做检测
var MQRoute = {};
var recvMQTimeVal = 100;
function recvMQ() {
    var initMQTimer = setInterval(function() {
        if (!window.external) {
            return;
        }
        clearInterval(initMQTimer);
        setInterval(function() {
            var msg = window.external.recv_mq_msg();
            while (msg != "") {
                //收到MQ消息处理
                if(typeof (msg)!="string"){//如果收到的消息不是字符串，先转成字符串
                    msg=json.stringify(msg);
                };
                if(msg.indexOf("M18")!=-1){//如果收到的是M18，调用处理函数
                    isReady(msg);
                }
                else{
                    notM18();
                }
                judegMQMessageForStudent(msg);
                msg = window.external.recv_mq_msg();
            }
        }, recvMQTimeVal);

    }, 1000);
};
function judegMQMessageForStudent(msg) {
    var jsonData = strToJson(msg);
    for (tmp in MQRoute) {
        var key = strToJson(tmp);
        var value = MQRoute[tmp];
        var handle = value.callback;
        if (!key.messagetype || !jsonData.messagetype || key.messagetype != jsonData.messagetype) {
            continue;
        }
        if (key.roomid && (!jsonData.roomid || key.roomid != jsonData.roomid)) {
            continue;
        }
        if (key.areaid && (!jsonData.areaid || key.areaid != jsonData.areaid)) {
            continue;
        }
        if (key.examid && (!jsonData.examid || key.examid != jsonData.examid)) {
            continue;
        }
        if (key.command && (!jsonData.command || key.command != jsonData.command)) {
            continue;
        }
        if (typeof handle == 'function') {
            if (value.para) {
                if (key.requireMQmsg) {
                    handle(value.para, jsonData);
                } else {
                    handle(value.para);
                }
            } else {
                if (key.requireMQmsg) {
                    handle(jsonData);
                } else {
                    handle();;
                }
            }
        }
    }
};
function registerMQProcess(config, callback, para) {//注册该模块MQ消息响应处理
    var value = {
        "callback": callback,
        "para": para
    };
    MQRoute[jsonToStr(config)] = value;
}

function registerPCStudent(roomID) {

    var config = {
        "messagetype": "M18",
        "roomid": roomID,
    };
    registerMQProcess(config, isReady); //考官确认考试开始

    //config["messagetype"] = "M8"
    //registerMQProcess(config, toExamEnd, '2'); //考官确认考试结束，请等待

    //config["messagetype"] = "M9"
    //registerMQProcess(config, toExamEnd, '2'); //前往下一个考站

    //config["messagetype"] = "M10"
    //registerMQProcess(config, toExamEnd,'3'); //考生全部考试完成，考试结束
    //registerMQProcess(config, qeuryStudentByUid);

    //config["messagetype"] = "M13"
    //registerMQProcess(config, toVerifyCode); //考前准备,通知绑定设备，转换到输入校验码的地方

    /*config["messagetype"] = "M12"
     registerMQProcess(config, toCloseExam); //正常考试结束，解除绑定*/

    //config["messagetype"] = "M15"
   // registerMQProcess(config, toChooseQuestion); //考官确认考生信息，开始选题

    //config["messagetype"] = "M16"
    //config["requireMQmsg"] = true;
    //registerMQProcess(config, toShowQuestionTip); //考官推送图片
};
function jsonToStr(jsonData) {
    var str = JSON.stringify(jsonData);
    return str;
};
function strToJson(str) { // 服务端有时会返回非json格式的字符串错误信息，此处需要捕获异常，暂时只输出日志，不做其他的处理。
    var json = {};
    try {
        json = JSON.parse(str);
    } catch (err) {
        cLOG("转化字符串到json异常");
    }
    return json;
};
