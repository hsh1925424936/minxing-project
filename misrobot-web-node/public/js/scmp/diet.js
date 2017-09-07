var dietList = { //列表
    command: "diet/alldietlist",
    type:1,        //类型过滤(类型为上一个接口)，默认为-1，全部
    isinternal: 1,   //1为电视大屏web， 0为后台管理web
    reqnum: 0,
    recommended: 1   //-1 为全部， 1表示已经推荐，0未推荐
};
var dietMenu = {   //导航
    command: "diet/diettypelist",
    "loginid" : $.cookie('uid'),
    "sessionid": $.cookie('sid')
};
//导航
var first_menus_id = 1;
diettypelist();
function diettypelist(){
    $.ajax({
        type: "POST",
        url: "/diet/diettypelist",
        dataType: "json",
        data: JSON.stringify({
            "1": dietMenu
        }),
        contentType: "application/json; charset=utf-8",
        success : function(result) {
            console.log(result);
            //分类菜单
            var navigation = document.getElementById("navigation");
            var menuContent = "";
            menuContent += '<div class="menuSwitch active2" id="src_'+result["1"].list[0].id+'">' + result["1"].list[0].name +'</div>';
            for(var i=1;i<result["1"].list.length;i++){
                menuContent += '<div class="menuSwitch" id="src_'+result["1"].list[i].id+'">' + result["1"].list[i].name +'</div>';
            }
            first_menus_id = result["1"].list[0].id;
            navigation.innerHTML += menuContent;
            alldietlist();
            //点击分类菜单切换
            $(".menuSwitch").click(function(){
                dietList.type = (this.id).split("_")[1];
                recommended = dietList.id;
                alldietlist();
                $(".menuSwitch").eq($(this).index()).addClass("active2").siblings().removeClass("active2");
            })
        }
    })
};
//列表
function alldietlist(){
    $.ajax({
        type: "POST",
        url: "/diet/alldietlist",
        dataType: "json",
        data: JSON.stringify({
            "1": dietList
        }),
        contentType: "application/json; charset=utf-8",
        success : function(resultDietlist){
            console.log(resultDietlist);
            //推荐
            var arr = resultDietlist["1"].list;
            var htmlstr = "";
            for(var i=0;i<arr.length;i++){
                var str =
                    '<div class="infoBox" onclick="jumpHref(this,0);" title="../../pages/scmp/dietDetail.html&file='+arr[i].diet_id+'">'
                    +'<img src="'+ arr[i].dietimgurl + '" class="infoPic"/>'
                    +'<div class="infoTitle">'+ arr[i].diet_title+'</div>'
                    +'<div class="category">' + arr[i].diet_typename + '</div>'
                    +'</div>';
                htmlstr = htmlstr + str;
            }
            $(".tongueTip").html(htmlstr);
            //分类
            var classifyData= resultDietlist["1"].list;
            var classifyList = "";
            for(var i=0;i<classifyData.length;i++){
                var classifyContent =
                    '<div class="infoBox" onclick="jumpHref(this,1);" title="../../pages/scmp/dietDetail.html&file='+classifyData[i].diet_id+'">'
                    +'<img src="'+ classifyData[i].dietimgurl + '" class="infoPic"/>'
                    +'<div class="infoTitle">'+ classifyData[i].diet_title+'</div>'
                    +'</div>';
                classifyList = classifyList + classifyContent;
            }
            $("#classifyContentInfo").html(classifyList);
        },error:function(ret){
            console.log(ret);
        }
    })
}
