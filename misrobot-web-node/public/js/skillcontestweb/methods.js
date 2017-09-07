function postJson(url,json,callback,errorfn,errConnect){//ajax方法函数
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
                msg= $.parseJSON(msg);
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
            errConnect();
        },
    })
};
function pushHeatBeat(){
    var json={
        command:"examstation/queryroomstatus",
        deviceid:window.external.get_cfg("js.device_id"),
        heartbeat:"1"
    };
    var sendJson={
        "1":json,
    };
    sendJson=JSON.stringify(sendJson);
    $.ajax({
        type:"POST",
        url:"/examstation/queryroomstatus",
        data:sendJson,
        dataType:"json",
        contentType: "application/json; charset=utf-8",
        success:function(msg){
            if(typeof(msg)=="string"){
                msg= $.parseJSON(msg);
            };
            $.each(msg,function(x,y){
                if(x=="1"){
                    if(y.errcode==0){
                        return
                    }
                };
            });
        }
    })
}
