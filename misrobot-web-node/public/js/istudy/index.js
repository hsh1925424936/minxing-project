/**
 * istudy base js file
 */


// lout out function
function logout() {
 	if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1){
		uselayer(2, "确定要退出互动课堂吗？",function(){
			window.JavaInterface.JavaScriptLogout(); //callback android OS logout function
		})
 	}else if(navigator.userAgent.indexOf("iPhone")!=-1){
 		// callback ios OS function
		uselayer(2, "确定要退出互动课堂吗？",function(){
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('Logout', {}, function responseCallback(responseData) {});
			});
		})
 	}
}
function logoutquick(){
	if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1){
		layer.msg("登陆信息失效，请重新登陆")
		setTimeout(function(){
			window.JavaInterface.JavaScriptLogout(); //callback android OS logout function
		},3000)
	}else if(navigator.userAgent.indexOf("iPhone")!=-1) {
	// callback ios OS function
		layer.msg("登陆信息失效，请重新登陆")
		setTimeout(function(){
			setupWebViewJavascriptBridge(function (bridge) {
				bridge.callHandler('Logout', {}, function responseCallback(responseData) {
				});
			});
		},3000)
	}
}
// get WiFi SSID
function getWiFiSSID(){
	if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1){
		return window.JavaInterface.JavaScriptGetWiFiStatus("GetWiFiSSID");
 	}else if(navigator.userAgent.indexOf("iPhone")!=-1){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('GetWiFiSSID', {'WIFIStatus':'outSend'}, function responseCallback(responseData) {
				return responseData;
			});
		});
 	}
}

/* 
{
	sessionid: '',
	userid:'',
	password:''	
}
*/
function setUserInfo(json) {
	if(!json.sessionid || !json.userid ){
		logout();
	}else{
		setCookie('gy_t', json.sessionid, 7);
		setCookie('gy_u', json.userid, 7);
	}
}

// is javacript bridge to ios OS
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
};
