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
		"personList":[],/*类型 列表*/
		"deptList":[],//科室列表
		"title":"",/*关键字*/
		"personType":-1,/*人群*/
		"deptType":-1,/*科室*/
		"reqnum":4,/*每页请求的条数*/
		"page" : 1,/*当前页*/
		"list":[],/*列表*/
		"pageDis":[],/*分页数组*/
		"pages":1,
		"typeAdd":-2,
		"person_type_add":-2,
		"dept_type_add":-2,
		"typeBtn1":2,
		"typeBtn2":false,
		"contentAdd":"",
		"disease_person_type_up":-2,
		"disease_dept_typename":-2,
		"titleAdd":"",
		"summary":"",
		"qrCodeurl":qurl,
		//"qid":-1,
		"disease_id":-1,
		"ewmurl":"",
		"detail":{},
		"sulen":160,
		"fdfs_group":"",
		"fdfs_path":"",
		
		
		
		
		

	},
	methods:{
		addCk:function(){
			this.titleAdd="";
			var content = CKEDITOR.instances.editor.setData("");
			this.person_type_add=-2;
			this.dept_type_add=-2;
			this.fdfs_group="";
			this.fdfs_path = "";
			$("#addFile").val("");
			formData = new FormData();
		},
		getCurrQr:function(currId){
			this.fdfs_group="";
			this.fdfs_path = "";
			$("#upFile").val("");
			formData = new FormData(); 
			var $this = this;
			var data ={
			    "1": {
			        "command": "diseaseprevention/diseasedetail",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
		        	"id" : currId
			    }
			};
			this.post("/diseaseprevention/diseasedetail",data,function(data2){
				$this.detail = data2["1"];
				$this.disease_person_type_up = $this.detail.disease_person_type;
				
				$this.disease_dept_type_up = $this.detail.disease_dept_type;
				
				var content = CKEDITOR.instances.editor2.setData($this.detail.disease_content);
			});
		},
		updateDept:function(){
			var $this = this;
			if(this.disease_person_type_up == -2){
				this.showError("请选择按人群分类");
				return;
			}
			if(this.disease_dept_typename_up == -2){
				this.showError("请选择按科室分类");
				return;
			}
			if(this.detail.disease_title == ""){
				this.showError("标题不能为空");
				return;
			}
			

			var content = CKEDITOR.instances.editor2.getData();
			if(content == ""){
				this.showError("内容不能为空");
			}
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined || $.cookie('uname')==undefined ||$.cookie('uid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			this.detail.disease_content =content;
			
			var data = {
			    "1": {
			        "command": "diseaseprevention/upddisease",
			        "loginid" : $.cookie('uid'),
			        "sessionid" : $.cookie('sid'),
			        "id" : this.detail.id,
			        "uid"  : $.cookie('uid'),
			        "uname" : $.cookie('uname'),
			        "title" : this.detail.disease_title,
			     	"person_type":this.disease_person_type_up,
			     	"dept_type":this.disease_dept_type_up,
			        "content" : this.detail.disease_content,
			        "fdfs_group":this.fdfs_group,
			        "fdfs_path":this.fdfs_path
			    }
			};
			var url = "/diseaseprevention/upddisease";
			this.post(url,data,function(data2){
				$("#upModal").modal("hide");
				$this.shModal("修改","修改成功");
				$this.diseaselist();
			},$("#upModal"));
		},
		addDeptPrev:function(){
			if(this.person_type_add == -2){
				this.showError("请选择人群分类");
				return;
			}
			if(this.dept_type_add == -2){
				this.showError("请选择科室分类");
				return;
			}
			if(this.titleAdd == ""){
				this.showError("标题不能为空");
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
			        "command": "diseaseprevention/adddisease",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			        "person_type" : this.person_type_add,
			        "dept_type" : this.dept_type_add,
					
			        "uid"  :  $.cookie('uid'),
			        "uname" : $.cookie('uname') ,
			        "title" : this.titleAdd,
			        "content" : content,
			        "fdfs_path":this.fdfs_path,
			        "fdfs_group":this.fdfs_group
			       
			    }
			};
			
			this.post("/diseaseprevention/adddisease",data,function(data2){
				$("#addModal").modal("hide");
				$this.shModal("添加","添加成功");
				$this.diseaselist();
			},$("#addModal"));
			
			
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
				this.diseaselist();
			}
			
		},
		showError:function(errorCon){
			var errot = $('<div id="errorPrompt" class="animated wobble">'+errorCon+'</div>');
			
			//$("#errorPrompt").html(errorCon).show();
			$("body").append(errot);
			setTimeout(function(){
				errot.remove();
			},3000);
			
		},
		shModal:function(oitle,ocontent){
			$("#otherModal-title").html(oitle);
			$("#otherModal-con").html(ocontent);
			$("#otherModal").modal('show');
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
			                	
			                
			                }else{
			                	alert(json.code);
			             
			                }
			            }
			        }

				};
				xhr.upload.addEventListener("progress", function onprogress(evt){
					var loaded = evt.loaded;       //已经上传大小情况 
					var tot = evt.total;

				}, false);
				xhr.open("post", url, true);
			    xhr.send(formData);  
		},
		deleteDept:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "diseaseprevention/deldisease",
			        "loginid" : $.cookie('uid') || "", 
		        	"sessionid": $.cookie('sid') || "",
		        	"id":this.disease_id
			    }
			};
			
			this.post("/diseaseprevention/deldisease",data,function(data2){
				$("#delModal").modal("hide");
				$this.shModal("删除","删除成功");
				$this.diseaselist();
			},$("#delModal"));
		},

		persontypelist:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "diseaseprevention/persontypelist",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			    }
			};
			this.post("/diseaseprevention/persontypelist",data,function(data2){
				
				$this.personList = data2["1"].list;
				
			});
		},
		depttypelist:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			        "command": "diseaseprevention/depttypelist",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
			    }
			};
			this.post("/diseaseprevention/depttypelist",data,function(data2){
				
				$this.deptList = data2["1"].list;
				
			});
		},
		searchdisPrev:function(){
			this.page = 1;
			this.diseaselist();
		},
		getTypeId1:function(typeId){
			this.page = 1;
			this.deptType = -1;
			this.personType = typeId;
			this.diseaselist();
		},
		getTypeId2:function(typeId){
			this.page = 1;
			this.personType = -1;
			this.deptType = typeId;
			this.diseaselist();
		},
		upBtn1:function(){
			this.deptType = -1;
			this.typeBtn1 = true;
			this.typeBtn2 = false;
			this.diseaselist();
		},
		upBtn2:function(){
			this.personType = -1;
			this.typeBtn1 = false;
			this.typeBtn2 = true;
			this.diseaselist();
		},
		
		diseaselist:function(){
			var $this = this;
			if($.cookie('uid')==undefined || $.cookie('sid')==undefined){
				parent.window.location.href="/pages/scmp/login.html";
			}
			var data ={
			    "1": {
			    	
			        "command": "diseaseprevention/diseaselist",
			        "loginid" : $.cookie('uid'), 
		        	"sessionid": $.cookie('sid'),
		        	"title" : this.title,
			        "type" : this.type,
			        "reqnum" : this.reqnum,
			        "page" : this.page,
			        "recommended":"-1",
			        "isinternal":"0",
			        "person_type":this.personType,
			        "dept_type":this.deptType,
			    }
			};
			this.post("/diseaseprevention/diseaselist",data,function(data2){
				 
				$this.list = data2["1"].list;
				for(var i = 0;i<$this.list.length;i++){
					$this.list[i].disease_desc = $this.list[i].disease_desc.replace(/<img.*?>/g,'')
				}
				$this.pages = data2["1"].pages;
				$this.page = data2["1"].page;
				$this.pageList();
			});
		},
		
		pageList:function(){
			var interval = 7;
			this.pageDis = [];
			if(this.pages<=interval){
				for(var i=1;i<=this.pages;i++){
					this.pageDis.push(i);
				}
			}else if(this.pages>interval){
				if(this.page<=(interval+1)/2){
					for(var i=1;i<interval-2;i++){
						this.pageDis.push(i);
					}
					this.pageDis.push("...");
					this.pageDis.push(this.pages-1);
					this.pageDis.push(this.pages);
					
				}else if(this.page>(interval+1)/2 && this.page < this.pages-1){
					this.pageDis.push(1);
					this.pageDis.push("...");
					for(var i=this.page-2;i<=this.page+2;i++){
						this.pageDis.push(i);
					}
					if(this.page+2<this.pages){
						this.pageDis.push("...");
						this.pageDis.push(this.pages);
					}
					
				}else if(this.page >=this.pages-1){
					this.pageDis.push(1);
					this.pageDis.push("...");
					for(var i=this.pages-(interval-4);i<=this.pages;i++){
						this.pageDis.push(i);
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
	filters:{
		typeName:function(tName){
			//console.log(alert(this));
			if(vm.typeBtn1){
				
				return tName.disease_person_typename;
			}else{
				return tName.disease_dept_typename;
			}
		}
	},
	mounted:function(){
		this.persontypelist();
		this.depttypelist();
		this.diseaselist();
		//this.healthylist();
	}
	
});

