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

// function openSearch() {
//     console.log('js/@@#@');
//     if ($('.searchForm').is(':visible')) {
//         $('.smsearch').show();
//         $('.searchForm').hide();
//     }
//     else {
//         $('.smsearch').hide();
//         $('.searchForm').show();
//     }
// }

var shade = {//生成遮罩的方法
    shadeOpen:function(){
        $('body').append('<div class="myshade" style="width:100%;'+
            'height:100%; background-color:rgba(0,0,0,0.5); position:fixed;'
            +'z-index:100; top:0; left:0;"></div>');
    },
    shadeClose:function(){
        $('.myshade').remove();
    }
 }

function close_iframe(){//关闭iframe弹窗的方法,在父窗口的方法，供子框架网页调用
    shade.shadeClose();
    $('#iframe_dialog').remove();
}

// $(function() {
//     $('.closeSpan').click(function() {//点击左上角关闭iframe
//         parent.close_iframe();
//     });
//     $('.closeBtn').click(function() {//点击关闭按钮关闭iframe
//         parent.close_iframe();
//     });
// });

function open_dialog(src){//打开弹窗的方法
    shade.shadeOpen();
    $('body').append('<iframe src="'+src+'" id="iframe_dialog" style="display:block;'+
        'position:fixed; left:50%; top:50%;'+
        'border-radius:5px; z-index:110; background-color:white; width:0px; height:0px;"></iframe>');
        $('#iframe_dialog').load(function() {
            $(this).contents().find("html").css('overflow', 'hidden');
            var children = $(this).contents().find("body").children();
            var width = parseInt(children.css('width'));
            var height = parseInt(children.css('height'));
            $(this).css('width', width+'px'); $(this).css('margin-left', (-width/2)+'px');
            $(this).css('height', height+'px'); $(this).css('margin-top', (-height/2)+'px');

            $(this).contents().find(".closeSpan").click(function() {//点击左上角关闭iframe
                parent.close_iframe();
            });
            $(this).contents().find(".closeBtn").click(function() {//点击左上角关闭iframe
                parent.close_iframe();
            });
        });
}




