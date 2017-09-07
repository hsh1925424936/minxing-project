var isinternal = 1;      //1为电视大屏web， 0为后台管理web
var recommended = -1;    //-1 为全部， 1表示已经推荐，0未推荐
var type = 1;           //类型过滤(类型为上一个接口)，默认为-1，全部
//舌尖健康列表
var jsonContentList = {
    command: "health/allhealthlist",
    isinternal: 1,
    recommended: 1,
    type: -1,
    reqnum: 0
};
var jsonDataInfo = {
    "command": "health/healthtypelist",  //健康类型菜单
    "loginid" : $.cookie('uid'),
    "sessionid": $.cookie('sid'),
};
var first_menus_id = -1;
healthtypelist();
function healthtypelist(){
    $.ajax({
        type: "POST",
        url: "/health/healthtypelist",
        dataType: "json",
        data: JSON.stringify({
            "1": jsonDataInfo
        }),
        contentType: "application/json; charset=utf-8",
        success : function(result){
            //分类菜单
            var navigation = document.getElementById("navigation");
            var menuContent = "";
            menuContent += '<div class="menuSwitch active2" id="src_'+result["1"].list[0].id+'">' + result["1"].list[0].name +'</div>'
            for(var i=1;i<result["1"].list.length;i++){
                menuContent += '<div class="menuSwitch" id="src_'+result["1"].list[i].id+'">' + result["1"].list[i].name +'</div>'
            }
            first_menus_id = result["1"].list[0].id;
            navigation.innerHTML += menuContent;
            //jsonContentList.recommended = -1;
            contentList();
            //点击分类菜单切换
            $(".menuSwitch").click(function(){
                jsonContentList.type = (this.id).split("_")[1];
                recommended = jsonContentList.id;
                contentList();
                $(".menuSwitch").eq($(this).index()).addClass("active2").siblings().removeClass("active2");
            })
        }
    })
}
function contentList(){
    $.ajax({
        type: "POST",
        url: "/health/allhealthlist",  //舌尖健康列表
        dataType: "json",
        data: JSON.stringify({
            "1": jsonContentList
        }),
        contentType: "application/json; charset=utf-8",
        success : function(results){
            console.log(results);
            //推荐
            var arr = results["1"].list;
            var htmlstr = "";
            for(var i=0;i<arr.length;i++){
                var str =
                    '<div class="infoBox" onclick="jumpHref(this,0);" title="../../pages/scmp/detail.html&file='+arr[i].health_id+'">'
                    +'<img src="'+ arr[i].healthimgurl + '" class="infoPic"/>'
                    +'<div class="infoTitle">'+ arr[i].health_title+'</div>'
                    +'<div class="category">' + arr[i].health_typename + '</div>'
                    +'</div>';
                htmlstr = htmlstr + str;
            }
            $(".tongueTip").html(htmlstr);
            //分类
            var classifyData= results["1"].list;
            var classifyList = "";
            for(var i=0;i<classifyData.length;i++){
                var classifyContent =
                    '<div class="infoBox" onclick="jumpHref(this,1);" title="../../pages/scmp/detail.html&file='+classifyData[i].health_id+'">'
                    +'<img src="'+ classifyData[i].healthimgurl + '" class="infoPic"/>'
                    +'<div class="infoTitle">'+ classifyData[i].health_title+'</div>'
                    +'</div>';
                classifyList = classifyList + classifyContent;
            }
            $("#classifyContentInfo").html(classifyList);
        },error:function(ret){
            console.log(ret);
        }
    })
}
