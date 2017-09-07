/***
 * 
 */


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}


var qid = getQueryString("qid");
//alert(qid2);
/*
var url = window.location.href;

var index = url.lastIndexOf("=");
var qid = 0;
if(index!=-1){
        qid = url.substring(index+1);
}
*/
//alert(qid);

var vm = new Vue({
	el:"#con",
	data:{
		"detail":{}
	},
	methods:{
		deFun:function(){
			
			var $this = this;
			var data ={
			    "1": {
			        "command": "qrcode/qrcodedetail",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
		        	"id" : qid
			    }
			};
			this.post("/qrcode/qrcodedetail",data,function(data2){
				$this.detail = data2["1"];
				console.log($this.detail.qrcode_content);
				
				
				
			});
		},
		
		post:function(url,data,onlineCallback){
			var $this = this;
			$.ajax({
				type:"post",
				url:url,
				contentType:"application/json",
				dataType:"json",
				data:JSON.stringify(data),
				success:function(data2){
					
					if(data2["1"].errcode == 9904){
						alert("由于您长时间未进行任何操作，需要重新登录");
						parent.window.location.href="/pages/scmp/login.html"
					}else if(data2["1"].errcode == 0){
						onlineCallback(data2);
						console.log(234);
						
					}else{
						alert(data2["1"].errdesc);
						//$this.shModal("错误提示",data2["1"].errdesc);
					}

				}
			});
		}
		
	},
	mounted:function(){
		this.deFun();
	}

});

	
