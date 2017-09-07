function checkAmount(obj) {
    var oldValue = $(obj).val();
    
    if (isNaN(oldValue)) {
        alert("请输入有效值。");
        $(obj).val("0.00");
        return false;
    }
    
    if(oldValue!="")
        $(obj).val(parseFloat(oldValue).toFixed(2));
    
    return true;
}

function arrContain(arr,value) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == value)
			return true;
	}
	
	return false;
}

function arrRemove(arr,item) {  
	for(var i = 0; i < arr.length; i++) {  
		if(item == arr[i])
			arr.splice(i,1); 
	}  
}

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

function open_dialog(src){//打开弹窗的方法
    shade.shadeOpen();
    $('body').append('<iframe src="'+src+'" id="iframe_dialog" style="display:block;'+
        'position:fixed; left:50%; top:50%; border:1px solid #999;'+
        'border-radius:5px; z-index:100000; background-color:white; width:0px; height:0px;"></iframe>');
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

            //让iframe可拖动
            var drag_obj = $(this).contents().find('.topCon');//被拖动的元素
            drag_obj.css('cursor', 'move');
            drag_obj.mousedown(function(event) {
                //存放初始鼠标的位置
                drag_obj._x = event.pageX;
                drag_obj._y = event.pageY;
                drag_obj.mousemove(function(e){
                    var change_x = e.pageX-drag_obj._x;//x方向的变化值
                    var change_y = e.pageY-drag_obj._y;//y方向的变化值
                    parent.drag_iframe(change_x,change_y);
                });

            });
            drag_obj.mouseup(function(event) {
                drag_obj.unbind("mousemove");
            });

            var iframe_dialog = $(this);
            $(window).resize(function() {
                iframe_dialog.css('left', '50%');
                iframe_dialog.css('top', '50%');
            });

        });
}

function drag_iframe(change_x,change_y){//拖动iframe的方法
    var pre_left = $('#iframe_dialog').css('left'); pre_left = parseInt(pre_left);
    var now_left = pre_left+change_x; now_left = now_left+'px';

    var pre_top = $('#iframe_dialog').css('top'); pre_top = parseInt(pre_top);
    var now_top = pre_top+change_y; now_top = now_top+'px';

    $('#iframe_dialog').css('left',now_left);

    $('#iframe_dialog').css('top',now_top);
}