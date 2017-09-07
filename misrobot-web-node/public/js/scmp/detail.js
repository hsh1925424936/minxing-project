var isinternal = 1;  //0是后台管理web， 1是 电视大屏页面
var jsonDetail = {
    "command": "health/healthdetail",
    "loginid" : $.cookie('uid'),
    "sessionid": $.cookie('sid'),
    "isinternal": 1,
    "id": 1
};
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};
jsonDetail.id = getQueryString("file");

detailContent();
function detailContent(){
    $.ajax({
        type: "POST",
        url: "/health/healthdetail",
        dataType: "json",
        data: JSON.stringify({
            "1": jsonDetail
        }),
        contentType: "application/json; charset=utf-8",
        success : function(result){
            console.log(result);
            $(".fontCenter").html(result["1"].health_title); //详情标题
            $("#imgData").attr("src",result["1"].imgurl);
            $("#cont").html(result["1"].health_content);
        }
    })
}
