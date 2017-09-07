import $ from 'jquery'
import {baseUrl} from './env'
import {MessageBox} from 'element-ui'
import router from '../router'
let post  = (url, data, param)=>{
		url = baseUrl+url
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
            	clearTimeout(window.alertTimer);
            	window.alertTimer = setTimeout(function(){   			
		            MessageBox.alert('登录信息失效，请重新登录！','提示',{type:'warning'}).then(()=>{router.push({name:'Login'})});
	    		},1000);
            }
            return res;
        });
    };
let setTitle=(titletext) => {
    $('title').html(titletext)
};
let setStorage=(name,val)=>{
	localStorage.setItem(name,val);
};
let getStorage = (name)=>{
	return localStorage.getItem(name);
};
let removeStorage =(name)=>{
	localStorage.setItem(name,'');
};
 let getCookie= (name) =>{//获取cookie
	    var arr = document.cookie.split("; ");
	    for (var i = 0 ; i<arr.length; i++) {
	        var _arr = arr[i].split("=");
	        if (_arr[0]==name) {
	            return _arr[1];
	        }
	    }
	    return "";
	};
let setCookie = (name,value,iDay) =>{//设置cookie
	    var oDate = new Date();
	    if (iDay>10) {
	        oDate.setMinutes(oDate.getMinutes()+iDay);
	    } else {
	        oDate.setDate(oDate.getDate()+iDay);
	    }
	    document.cookie=name+"="+value+";expires="+oDate+";Path=/";
	};
let removeCookie = (name) =>{//删除cookie
	    setCookie(name,"",-1);
	};

let exportExcel=(data)=> {

    var url = baseUrl+'/export/exportExcel';
    var name = "download_name" + new Date().getTime();
    var $iframe = $('<iframe name="' + name + '"></iframe>').appendTo('body');
    var $form = $('<form target="' + name + '" action="' + url + '" method="POST" ' +
                        'enctype="application/x-www-form-urlencoded">' +
                  '</form>').appendTo('body');
    var $content = $('<input type="hidden" name="_form_body" />').appendTo($form);
    
    $iframe.css("display", "none");
    $form.css("display", "none");
    
    $content.val(JSON.stringify({
        "1": data
    }));
    $form.submit();
};
let exportWord=(data)=> {

    var url = baseUrl+'/export/exportWord';
    var name = "download_name" + new Date().getTime();
    var $iframe = $('<iframe name="' + name + '"></iframe>').appendTo('body');
    var $form = $('<form target="' + name + '" action="' + url + '" method="POST" ' +
                        'enctype="application/x-www-form-urlencoded">' +
                  '</form>').appendTo('body');
    var $content = $('<input type="hidden" name="_form_body" />').appendTo($form);
    
    $iframe.css("display", "none");
    $form.css("display", "none");
    
    $content.val(JSON.stringify({
        "1": data
    }));
    $form.submit();
};
let exportMouldExcel=(data)=> {

    var url = baseUrl+'/export/exportExcelMould';
    var name = "download_name" + new Date().getTime();
    var $iframe = $('<iframe name="' + name + '"></iframe>').appendTo('body');
    var $form = $('<form target="' + name + '" action="' + url + '" method="POST" ' +
                        'enctype="application/x-www-form-urlencoded">' +
                  '</form>').appendTo('body');
    var $content = $('<input type="hidden" name="_form_body" />').appendTo($form);
    
    $iframe.css("display", "none");
    $form.css("display", "none");
    
    $content.val(JSON.stringify({
        "1": data
    }));
    $form.submit();
};
let importExcel=($form, data, successFunc, errFunc) =>{
	
	
	$.ajaxFileUpload({
        url: '/import/importExcel',
        secureuri : false,
        timeout: 1000*60*2,
        fileElementId : $form,
        data : {
        	_upload_data: JSON.stringify({"1": data})
        },
        dataType : 'json',
        success : function(data, status) {
            // self.user = data.data;
            // self.refreshLoginUser(data.data);
            // self.hideLoading();
        	typeof successFunc == 'function' && successFunc(data);
        },
        error : function(data, status, e) {
            // self.hideLoading();
        	typeof errFunc == 'function' && errFunc(data);
        }
    });
}
export {
	post,
	setCookie,
	getCookie,
	setTitle,
	removeCookie,
	exportExcel,
	exportWord,
	exportMouldExcel,
	importExcel,
	setStorage,
	getStorage,
	removeStorage,
} 