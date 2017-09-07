/***
 * 
 */
var qurl = window.location.href;
var index = qurl.lastIndexOf("/");
if(index!=-1){
	 qurl= qurl.substring(0,index);
}
var formData = new FormData();
var vm = new Vue({
	el:"#con",
	data:{
		"heathList":[],/*类型 列表*/
		"title":"",/*关键字*/
		"type":-1,/*类型*/
		"reqnum":4,/*每页请求的条数*/
		"page" : 1,/*当前页*/
		"list":[],/*列表*/
		"pageHeat":[],/*分页数组*/
		"pages":1,
		"typeAdd":-2,
		"typeup":0,
		"titleAdd":"",
		"summary":"",
		"qrCodeurl":qurl,
		//"qid":-1,
		"heatId":-1,
		"ewmurl":"",
		"detail":{},
		"sulen":160,
		"fdfs_group":"",
		"fdfs_path":"",
		
		
		
		

	},
	methods:{
		addCk:function(){
			this.typeAdd=-2;
			this.titleAdd="";
			this.summary="";
			CKEDITOR.instances.editor.setData("");
			this.fdfs_group="";
			this.fdfs_path = "";
			$("#addFile").val("");
			formData = new FormData();
		},
		
		addHealthy:function(){
			
				
			if(this.typeAdd === "" || this.typeAdd==undefined || this.typeAdd == null || this.typeAdd == -2){
				this.showError("请选择类型");
				return;
			}
			if(this.titleAdd == ""){
				this.showError("标题不能为空");
				return;
			}
//			if(this.summary == ""){
//				this.showError("摘要不能为空");
//				return;
//			}
			
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
			        "command": "health/addhealth",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			        "type" : this.typeAdd,
			        "uid"  :  $.cookie('uid'),
			        "uname" : $.cookie('uname') ,
			        "title" : this.titleAdd,
			        "desc" :this.summary,
			        "content" : content,
			        "fdfs_path":this.fdfs_path,
			        "fdfs_group":this.fdfs_group
			        
			    }
			};
			
			this.post("/health/addhealth",data,function(data2){
				$("#addModal").modal("hide");
				$this.shModal("添加","添加成功");
				$this.healthylist();
			},$("#addModal"));
			
			
		},
		deleteHeat:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "health/delhealth",
			        "loginid" : $.cookie('uid') || "", 
		        	"sessionid": $.cookie('sid') || "",
		        	"id":this.heatId
			    }
			};
			
			this.post("/health/delhealth",data,function(data2){
				$("#delModal").modal("hide");
				$this.shModal("删除","删除成功");
				$this.healthylist();
			},$("#delModal"));
		},
		uploadImg:function(ev){
			
			formData = new FormData();
			var _this = ev.currentTarget;
			
			for(var i = 0; i != _this.files.length; i++){
				formData.append("file",_this.files[i]);
				
			}
			
			this.jsFile("/file/upload","缩略图上传","图片上传成功",_this);
		},
		jsFile:function(url,hideModal,otitle,ocontent,_this){
			
			
			
		    formData.append("command","file/load");
		    formData.append("loginid",$.cookie('uid'));
		    formData.append("sessionid",$.cookie('sid'));
		    formData.append("unane",$.cookie('uname'));
			var $this = this;
			var xhr = new XMLHttpRequest(); 
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
			            if (xhr.status == 200 || xhr.status == 1){
			                var result = xhr.responseText;
			                var json = eval("(" + result + ")");
			                
			                if(json.code == 9904){
			                	parent.window.location.href="/pages/scmp/login.html";
			                	
			                }else if(json.code == 200){
			                	alert("上传成功");
			                	$this.fdfs_group=json["data"].fdfs_group;
			                	$this.fdfs_path = json["data"].fdfs_path;
			                	
			                	//_this.disabled=false;
			                	//hideModal.modal("hide");
								//$this.shModal(otitle,ocontent);
								
								//$(".upPross").hide();
								//$this.loadList();
								//formData = new FormData();
			                	//$("#otherModal").modal("show");
			                }else{
			                	alert(json.code);
			                	//$(".upPross").hide();
			                	//hideModal.modal("hide");
			                	//$this.shModal("错误提示",json["1"].errdesc);
			                	//$("#otherModal").modal("show");
			                	//formData = new FormData();
			                }
			            }
			        }

				};
				xhr.upload.addEventListener("progress", function onprogress(evt){
					var loaded = evt.loaded;       //已经上传大小情况 
					var tot = evt.total;
//					$("#gray").show();
//					$(".upPross").show();
//					var upProW = $(".upPross").width()*(loaded/tot);
//					$(".upPro").css("width",upProW);
				}, false);
				xhr.open("post", url, true);
				//xhr.setRequestHeader("contentType","text/html;charset=uft-8") //指定发送的编码
  				//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  //设置请求头信息
			    xhr.send(formData);  
		},
		getCurrQr:function(currId){
			this.fdfs_group="";
			this.fdfs_path = "";
			$("#upFile").val("");
			formData = new FormData(); 
			var $this = this;
			var data ={
			    "1": {
			        "command": "health/healthdetail",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
		        	"id" : currId
			    }
			};
			this.post(" /health/healthdetail",data,function(data2){
				$this.detail = data2["1"];
				$this.typeup = $this.detail.health_type;
				
				var content = CKEDITOR.instances.editor2.setData($this.detail.health_content);
			});
		},
		recommend:function(heat){
			var $this = this;
			if(heat.health_recommended == 0){
				heat.health_recommended=1;
			}else{
				heat.health_recommended=0;
			}
			var data ={
			    "1": {
			        "command": "health/recommendop",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			        "id":heat.health_id,
			        "op":heat.health_recommended
			    }
			};
			this.post("/health/recommendop",data,function(data2){
				if(data2["1"].op == 1){
					$this.shModal("推荐","推荐成功");
					
				}else{
					$this.shModal("推荐","取消推荐成功");
					
				}
				$this.healthylist();
				 
				
			});
		},
		shModal:function(oitle,ocontent){
			$("#otherModal-title").html(oitle);
			$("#otherModal-con").html(ocontent);
			$("#otherModal").modal('show');
		},
		showError:function(errorCon){
			var errot = $('<div id="errorPrompt" class="animated wobble">'+errorCon+'</div>');
			
			//$("#errorPrompt").html(errorCon).show();
			$("body").append(errot);
			setTimeout(function(){
				errot.remove();
			},3000);
			
		},
		searchHealthy:function(){
			this.page = 1;
			this.healthylist();
		},
		getTypeId:function(typeId){
			this.page = 1;
			this.type = typeId;
			this.healthylist();
		},
		healthyType:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "health/healthtypelist",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			    }
			};
			this.post("/health/healthtypelist",data,function(data2){
				
				$this.heathList = data2["1"].list;
				
			});
		},
		updateHeat:function(){
			var $this = this;
			if(this.detail.health_type === "" || this.detail.health_type==undefined || this.detail.health_type== null){
				this.showError("请选择类型");
				return;
			}
			if(this.detail.health_title == ""){
				this.showError("标题不能为空");
				return;
			}
			
			
//			if(this.detail.health_desc == ""){
//				this.showError("摘要不能为空");
//				return;
//			}
		
			
			
			
			var content = CKEDITOR.instances.editor2.getData();
			if(content == ""){
				this.showError("内容不能为空");
			}
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined || $.cookie('uname')==undefined ||$.cookie('uid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			this.detail.health_content =content; 
			var data = {
			    "1": {
			        "command": "health/updhealth",
			        "loginid" : $.cookie('uid'),
			        "sessionid" : $.cookie('sid'),
			        "type" : this.typeup,
			        "id" : this.detail.id,
			        "uid"  : $.cookie('uid'),
			        "uname" : $.cookie('uname'),
			        "title" : this.detail.health_title,
			        "desc" :this.detail.health_desc,
			        "content" : this.detail.health_content,
			        "fdfs_group":this.fdfs_group,
			        "fdfs_path":this.fdfs_path
			       
			    }
			};
			var url = "/health/updhealth";
			this.post(url,data,function(data2){
				$("#upModal").modal("hide");
				$this.shModal("修改","修改成功");
				$this.healthylist();
			},$("#upModal"));
		},
		healthylist:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			
			var data ={
			    "1": {
			        "command": "health/healthlist",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
		        	"title" : this.title,
			        "type" : this.type,
			        "reqnum" : this.reqnum,
			        "page" : this.page,
			        "recommended":"-1",
			        "isinternal":"0"
			    }
			};
			this.post("/health/healthlist",data,function(data2){
				 
				$this.list = data2["1"].list;
				for(var i = 0;i<$this.list.length;i++){
					$this.list[i].health_desc = $this.list[i].health_desc.replace(/<img.*?>/g,'')
				}
				$this.pages = data2["1"].pages;
				$this.page = data2["1"].page;
				$this.pageList();
			});
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
				this.healthylist();
			}
			
		},
		pageList:function(){
			var interval = 7;
			this.pageHeat = [];
			if(this.pages<=interval){
				for(var i=1;i<=this.pages;i++){
					this.pageHeat.push(i);
				}
			}else if(this.pages>interval){
				if(this.page<=(interval+1)/2){
					for(var i=1;i<interval-2;i++){
						this.pageHeat.push(i);
					}
					this.pageHeat.push("...");
					this.pageHeat.push(this.pages-1);
					this.pageHeat.push(this.pages);
					
				}else if(this.page>(interval+1)/2 && this.page < this.pages-1){
					this.pageHeat.push(1);
					this.pageHeat.push("...");
					for(var i=this.page-2;i<=this.page+2;i++){
						this.pageHeat.push(i);
					}
					if(this.page+2<this.pages){
						this.pageHeat.push("...");
						this.pageHeat.push(this.pages);
					}
					
				}else if(this.page >=this.pages-1){
					this.pageHeat.push(1);
					this.pageHeat.push("...");
					for(var i=this.pages-(interval-4);i<=this.pages;i++){
						this.pageHeat.push(i);
					}
				}
				
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
		this.healthyType();
		this.healthylist();
	}
	
});

