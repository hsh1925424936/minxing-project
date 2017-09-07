var isinternal = 1;       //1为电视大屏web， 0为后台管理web
var person_type = 1;    //人群类型过滤(类型为上一个接口)，默认为-1，全部
var dept_type = -1;     //科室过滤,-1 为全部
var jsonPersontype = {
    "command": "diseaseprevention/persontypelist",  //人群类型导航列表
    "loginid" : $.cookie('uid'),
    "sessionid": $.cookie('sid')
};
var jsonDepttypelist = {
    "command": "diseaseprevention/depttypelist",  //科室类型导航列表
    "loginid" : $.cookie('uid'),
    "sessionid": $.cookie('sid'),
};
var jsonContentList = {   //疾病预防列表
    command: "diseaseprevention/alldiseaselist",
    isinternal: 1,         //1为电视大屏web， 0为后台管理web
    person_type: -1,       //人群类型过滤(类型为上一个接口)，默认为-1，全部
    dept_type: -1,         //科室过滤,-1 为全部
    reqnum: 0
 };
var first_menus_id = -1;
//人群类型导航列表
persontypelist();
function persontypelist(){
    $.ajax({
        type: "POST",
        url: "/diseaseprevention/persontypelist",
        dataType: "json",
        data: JSON.stringify({
            "1": jsonPersontype
        }),
        contentType: "application/json; charset=utf-8",
        success : function(result){
            //console.log(result);
            //人群类型分类菜单
            var navigation = document.getElementById("navigation");
            var menuContent = "";
            menuContent += '<div class="menuSwitch active2" id="src_'+result["1"].list[0].id+'">' + result["1"].list[0].name +'</div>';
            for(var i=1;i<result["1"].list.length;i++){
                menuContent += '<div class="menuSwitch" id="src_'+result["1"].list[i].id+'">' + result["1"].list[i].name +'</div>';
            }
            first_menus_id = result["1"].list[0].id;
            navigation.innerHTML += menuContent;
            jsonContentList.person_type = 1;
            alldiseaselist();
            //点击分类菜单切换
            $(".menuSwitch").click(function(){
                jsonContentList.person_type = (this.id).split("_")[1];
                alldiseaselist();
                $(".menuSwitch").eq($(this).index()).addClass("active2").siblings().removeClass("active2");
            })
        }
    })
}
//科室导航类型列表
depttypelist();
function depttypelist(){
    $.ajax({
        type: "POST",
        url: "/diseaseprevention/depttypelist",
        dataType: "json",
        data: JSON.stringify({
            "1": jsonDepttypelist
        }),
        contentType: "application/json; charset=utf-8",
        success : function(resultDept){
            var navigation2 = document.getElementById("navigation2");
            var menuContent2 = "";
            menuContent2 += '<div class="menuDepar active2" id="src_'+resultDept["1"].list[0].id+'">' + resultDept["1"].list[0].name +'</div>';
            for(var i=1;i<resultDept["1"].list.length;i++){
                menuContent2 += '<div class="menuDepar" id="src_'+resultDept["1"].list[i].id+'">' + resultDept["1"].list[i].name +'</div>';
            }
            first_menus_id = resultDept["1"].list[0].id;
            navigation2.innerHTML += menuContent2;
            jsonContentList.dept_type = -1;
            alldiseaselist();
            //点击分类菜单切换
            $(".menuDepar").click(function(){
                jsonContentList.dept_type = (this.id).split("_")[1];
                alldiseaselist();
                $(".menuDepar").eq($(this).index()).addClass("active2").siblings().removeClass("active2");
            })
        }
    })
}
//列表
function alldiseaselist(){
    $.ajax({
        type: "POST",
        url: "/diseaseprevention/alldiseaselist",  //舌尖健康列表
        dataType: "json",
        data: JSON.stringify({
            "1": jsonContentList
        }),
        contentType: "application/json; charset=utf-8",
        success : function(resultList){
            console.log(resultList);
            //按人群分
            var arr = resultList["1"].list;
            var htmlstr = "";
            for(var i=0;i<arr.length;i++){
                var str =
                    '<div class="infoBox" onclick="jumpHref(this,0);" title="../../pages/scmp/diseasDetail.html&file='+arr[i].disease_id+'">'
                    +'<img src="'+ arr[i].imgurl + '" class="infoPic"/>'
                    +'<div class="infoTitle">'+ arr[i].disease_title+'</div>'
                    +'</div>';
                htmlstr = htmlstr + str;
            }
            $(".tongueTip").html(htmlstr);
            //按科室分
            var classifyData= resultList["1"].list;
            var classifyList = "";
            for(var i=0;i<classifyData.length;i++){
                var classifyContent =
                    '<div class="infoBox" onclick="jumpHref(this,1);" title="../../pages/scmp/diseasDetail.html&file='+classifyData[i].disease_id+'">'
                    +'<img src="'+ classifyData[i].imgurl + '" class="infoPic"/>'
                    +'<div class="infoTitle">'+ classifyData[i].disease_title+'</div>'
                    +'</div>';
                classifyList = classifyList + classifyContent;
            }
            $("#classifyContentInfo").html(classifyList);
        },error:function(ret){
            console.log(ret);
        }
    })
}
