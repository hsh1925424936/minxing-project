/**
 * Created by liuchuanyang on 2017/3/10.
 */
import $ from 'jquery';
import store from './vuex/store';

const _setupWebViewJavascriptBridge = function(callback){   //ios桥函数
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
};

const invokeNative = function(methodName, param, callback) {
    _setupWebViewJavascriptBridge(function(bridge) {

        bridge.callHandler(methodName, param, function responseCallback(responseData) {
            callback && callback(responseData);
        });
    });
};

export default {
    isiOS: /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(navigator.userAgent || ''),
    isAndroid: /Android/i.test(navigator.userAgent || ''),
    post: (url, data, param) => {
        return $.ajax(url, $.extend({
            type: 'POST',
            contentType: "application/json"
        }, param, {
            data : JSON.stringify({
                "1": data
            })
        })).then(function (data, status, jqXhr) {

            let res = data && data['1'];

            if(res.errcode == 9904){
                store.commit('SHOW_TOAST', "登录信息已失效，请重新登录");
                setTimeout(function(){
                    invokeNative('Logout');
                }, 2000)
            }

            return res
        })
    },
    invokeNative: invokeNative,
    registerToNative: (name, method, callbackResponse) => {
        /*if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1) {
            // window.JavaInterface.JavaScriptLogout(); //callback android OS logout function
            // window.JavaInterface[name] = method;
            window[name] = method;
        } else{*/
            // callback ios OS function
            _setupWebViewJavascriptBridge(function(bridge) {
                bridge.registerHandler(name, function (data, responseCallback) {
                    method && method(data);
                    if(typeof responseCallback === 'function') {
                        responseCallback(callbackResponse);
                    }
                });
            });
        /*}*/
    },
    setTitle:(titletext) => {
        //var u = navigator.userAgent
        //var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
        //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        //if (isAndroid) {
        //    document.title = titletext
        //} else if (isiOS) {
        //    var $body = $('body')
        //    document.title = titletext
        //    var $iframe = $('<iframe src="/favicon.ico"></iframe>')
        //    $iframe.on('load', function () {
        //        window.setTimeout(function () {
        //            $iframe.off('load').remove()
        //        }, 0)
        //    }).appendTo($body)
        //}else{
        //    document.title = titletext
        //}
        $('title').html(titletext)
    }
};
