/**
 * Created by Administrator on 2016/5/25 0025.
 */
/*上传头像*/
$(".uploadHeadImg").click(function(){
    $("#fileupload").click();
});
$("body").on('change','#fileupload',function(){
    var files = document.getElementById("fileupload").files;
    var typeArr="";
    var type="";
    var totalSize = 0;
    for(var i=0;i<files.length;i++){
        totalSize += files[i].size/(1024*1024);
        typeArr = files[i].name.split(".");
        type = typeArr[typeArr.length-1];
        if(type!="jpg" && type!="jpeg" && type!="png"){
            layer.alert(
                "请上传图片文件",
                {title:["温馨提示","font-size:16px;color:#408aff"]}
            );
            return false;
        }
    }

    if (totalSize > 20) {
        layer.alert(
            "图片大小不能超过20MB",
            {title:["温馨提示","font-size:16px;color:#408aff"]}
        );
        return false;
    }
    $.ajaxFileUpload({
        type:"post",
        url:'',
        fileElementId:'fileupload',//必须要是 input file标签 ID
        dataType:"JSON",
        async: false,
        success: function ( status){//上传成功，后台返回图片路径，替换掉原图片路径
            $(".user-head-img").attr("src",status);
        },
        error: function (data, e){
            layer.alert(
                "上传失败！",
                {title:["温馨提示","font-size:16px;color:#408aff"]}
            );
        }
    });
})

 $(function () {
     //$('.search').click(openSearch);
     //$('.cancelsearch').click(openSearch);
     $('.bell').click(function() {
         window.location.href = 'see-msg.html';
     });
 })

