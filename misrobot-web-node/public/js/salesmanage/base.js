layui.use('layer', function(){
	var layer = layui.layer;
});

//改变url后面#的值
function changepage(str) {
    var _href = window.location.href;
    if (_href.indexOf('#')==-1) {
        window.location.href = _href+'#'+str;
    } else {
        window.location.href = _href.substring(0,_href.indexOf('#'))+'#'+str;
    }
};