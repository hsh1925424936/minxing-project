/**
 * Created by dell on 2016/6/29.
 */
var loadLayer = (function(mod) {

    /**
     * 检测设备类型
     * @author mao
     * @version 1.0
     * @date    2016-06-29
     */
    function IsPC(){
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "Windows Phone", "iPad");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false; break;
            }
        }
        return flag;
    }

    mod.Init = function(obj) {
        if(IsPC()) {
            var script = document.createElement('script');
            script.src = obj.PC.js;//'../src/layer.js';
            css = document.createElement('link');
            css.rel='stylesheet';
            css.href= obj.PC.css//'../src/skin/layer.css';

            document.getElementsByTagName('head')[0].appendChild(script);
            document.getElementsByTagName('head')[0].appendChild(css);
        } else {
            var css = document.createElement('link');
            css.rel='stylesheet';
            css.href= obj.mobile.css;//'../mobile/need/layer.css';
            script = document.createElement('script');
            script.src = obj.mobile.js;//'../mobile/layer.js';

            document.getElementsByTagName('head')[0].appendChild(css);
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }

    return mod;

})(loadLayer || {});

//初始化所需信息
var lib = {
    PC:{
        js:'/js/layer/layer.js',
        css:'/js/layer/skin/layer.css'
    },
    mobile:{
        js:'/js/layer/mobile/layer.js',
        css:'/js/layer/mobile/need/layer.css'
    }
};

//初始化
loadLayer.Init(lib);