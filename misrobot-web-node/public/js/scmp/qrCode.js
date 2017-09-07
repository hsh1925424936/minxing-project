/***
 * 
 */
var qurl = window.location.href;
var index = qurl.lastIndexOf("/");
if(index!=-1){
	 qurl= qurl.substring(0,index);
}
var vm = new Vue({
	el:"#con",
	data:{
		"qtList":[],/*类型列表*/
		"title":"",/*关键 字*/
		"type":-1,/*类型*/
		"reqnum":4,/*每页请求的条数*/
		"page" : 1,/*当前页*/
		"list":[],/*列表*/
		"pageQr":[],/*分页数组*/
		"pages":1,
		"typeAdd":-2,
		"typeup":0,
		"titleAdd":"",
		"summary":"",
		"qrCodeurl":qurl,
		"qid":-1,
		"ewmurl":"",
		"detail":{},
		"sulen":160
		
		
		

	},
	methods:{
		addCk:function(){
			 this.typeAdd=-2;
			 this.titleAdd="";
			 this.summary="";
			 CKEDITOR.instances.editor2.setData("");

		},
		qrPreview:function(curid){
			this.qid = "";
			this.qrCodeurl="";
			this.qid = curid;
			this.qrCodeurl =this.qrCodeurl+"qrCodeDetail.html"+"?qid="+ this.qid+"&m="+Math.ceil(Math.random()*1000);
		},
		showError:function(errorCon){
			var errot = $('<div id="errorPrompt" class="animated wobble">'+errorCon+'</div>');
			
			//$("#errorPrompt").html(errorCon).show();
			$("body").append(errot);
			setTimeout(function(){
				errot.remove();
			},3000);
			
		},
		qrenlarge:function(qrcodeimgurl){
			this.ewmurl = qrcodeimgurl;
			$("#ewmfd").modal("show");
		},
		searchQr:function(){
			this.page = 1;
			this.qrcodelist();
		},
		getCurrQr:function(currId){
			
			var $this = this;
			var data ={
			    "1": {
			        "command": "qrcode/qrcodedetail",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
		        	"id" : currId
			    }
			};
			this.post("/qrcode/qrcodedetail",data,function(data2){
				$this.detail = data2["1"];
				$this.typeup = $this.detail.qrcode_type;
				
				var content = CKEDITOR.instances.editor2.setData($this.detail.qrcode_content);
			});
		},
		
		updateQr:function(){
			var $this = this;
			if(this.detail.qrcode_type === "" || this.detail.qrcode_type==undefined || this.detail.qrcode_type== null){
				this.showError("请选择类型");
				return;
			}
			if(this.detail.qrcode_title == ""){
				this.showError("标题不能为空");
				return;
			}
			if(this.detail.qrcode_desc == ""){
				this.showError("摘要不能为空");
				return;
			}
		
			
			
			
			var content = CKEDITOR.instances.editor2.getData();
			if(content == ""){
				this.showError("内容不能为空");
			}
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined || $.cookie('uname')==undefined ||$.cookie('uid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			this.detail.qrcode_content =content; 
			var data = {
			    "1": {
			        "command": "qrcode/updqrcode",
			        "loginid" : $.cookie('uid'),
			        "sessionid" : $.cookie('sid'),
			        "type" : this.typeup,
			        "id" : this.detail.id,
			        "uid"  : $.cookie('uid'),
			        "uname" : $.cookie('uname'),
			        "title" : this.detail.qrcode_title,
			        "desc" :this.detail.qrcode_desc,
			        "content" : this.detail.qrcode_content
			    }
			};
			var url = "/qrcode/updqrcode";
			this.post(url,data,function(data2){
				$("#upModal").modal("hide");
				$this.shModal("修改","修改成功");
				$this.qrcodelist();
			},$("#upModal"));
		},
		addQrCode:function(){
			
				
			if(this.typeAdd === "" || this.typeAdd==undefined || this.typeAdd == null || this.typeAdd == -2){
				this.showError("请选择类型");
				return;
			}
			if(this.titleAdd == ""){
				this.showError("标题不能为空");
				return;
			}
			if(this.summary == ""){
				this.showError("摘要不能为空");
				return;
			}
			
			var content = CKEDITOR.instances.editor.getData();
			
			
			if(content == ""){
				this.showError("内容不能为空");
				return;
			}
			
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined || $.cookie('uname')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "qrcode/addqrcode",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			        "type" : this.typeAdd,
			        "uid"  :  $.cookie('uid'),
			        "uname" : $.cookie('uname') ,
			        "title" : this.titleAdd,
			        "desc" :this.summary,
			        "content" : content
			        
			    }
			};
			
			this.post("/qrcode/addqrcode",data,function(data2){
				$("#addModal").modal("hide");
				$this.shModal("添加","添加成功");
				$this.qrcodelist();
			},$("#addModal"));
			
			
		},
		shModal:function(oitle,ocontent){
			$("#otherModal-title").html(oitle);
			$("#otherModal-con").html(ocontent);
			$("#otherModal").modal('show');
		},
		getTypeId:function(typeId){
			this.type = typeId;
			this.qrcodelist();
		},
		deleteQr:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "qrcode/delqrcode",
			        "loginid" : $.cookie('uid') || "", 
		        	"sessionid": $.cookie('sid') || "",
		        	"id":this.qid
			    }
			};
			
			this.post("/qrcode/delqrcode",data,function(data2){
				$("#delModal").modal("hide");
				$this.shModal("删除","删除成功");
				$this.qrcodelist();
			},$("#delModal"));
		},
		qrcodetype:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "qrcode/qrcodetypelist",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			    }
			};
			this.post("/qrcode/qrcodetypelist",data,function(data2){
				
				$this.qtList = data2["1"].list;
				
			});
		},
		qrcodelist:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "qrcode/qrcodelist",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
		        	"title" : this.title,
			        "type" : this.type,
			        "reqnum" : this.reqnum,
			        "page" : this.page
			    }
			};
			this.post("/qrcode/qrcodelist",data,function(data2){
				
				$this.list = data2["1"].list;
				$this.pages = data2["1"].pages;
				$this.page = data2["1"].page;
				$this.pageList();
			});
		},
		pageList:function(){
			var interval = 7;
			this.pageQr = [];
			if(this.pages<=interval){
				for(var i=1;i<=this.pages;i++){
					this.pageQr.push(i);
				}
			}else if(this.pages>interval){
				if(this.page<=(interval+1)/2){
					for(var i=1;i<interval-2;i++){
						this.pageQr.push(i);
					}
					this.pageQr.push("...");
					this.pageQr.push(this.pages-1);
					this.pageQr.push(this.pages);
					
				}else if(this.page>(interval+1)/2 && this.page < this.pages-1){
					this.pageQr.push(1);
					this.pageQr.push("...");
					for(var i=this.page-2;i<=this.page+2;i++){
						this.pageQr.push(i);
					}
					if(this.page+2<this.pages){
						this.pageQr.push("...");
						this.pageQr.push(this.pages);
					}
					
				}else if(this.page >=this.pages-1){
					this.pageQr.push(1);
					this.pageQr.push("...");
					for(var i=this.pages-(interval-4);i<=this.pages;i++){
						this.pageQr.push(i);
					}
				}
				
			}

			
		},
		upPage:function(page){
			if(parseInt(page)){
				if(page>this.pages){
					return;
				}
				if(page<1){
					return;
				}
				this.page=page;
				this.qrcodelist();
			}
			
		},
		post:function(url,data,onlineCallback,hideModal){
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
						
						onlineCallback&&onlineCallback(data2);
					}else{
						//alert(data2["1"].errdesc);
						//this.shModal(data2["1"].errdesc);
						
						if(typeof hideModal =="object"){
							hideModal.modal("hide");
						}
						
						$this.shModal("错误提示",data2["1"].errdesc);
					}

				}
			});
		},
	},
	computed:{
		sheyu:function(){
			if(this.summary != undefined){
				if(this.summary.length>=this.sulen){
					this.summary = this.summary.substring(0,this.sulen);
					return this.sulen - this.summary.length;
				}else{
					return this.sulen - this.summary.length;
				}
			}
		},
		sheyu2:function(){
			if(this.detail.qrcode_desc != undefined){
				if(this.detail.qrcode_desc.length>=this.sulen){
					this.detail.qrcode_desc = this.detail.qrcode_desc.substring(0,this.sulen);
					return this.sulen - this.detail.qrcode_desc.length;
				}else{
					return this.sulen - this.detail.qrcode_desc.length;
				}
			}
		}
	},
	mounted:function(){
		this.qrcodetype();
		this.qrcodelist();
	}
	
});

