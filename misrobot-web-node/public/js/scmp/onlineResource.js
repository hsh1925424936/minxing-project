
var formData = new FormData();

Vue.directive('datepicker', {
	inserted: function(el, binding, vnode) {
		var self = this;
		var $el = $(el);
		
		$el.datepicker({
			language: "zh-CN",
			autoclose: true
		});
	}
});

var app5 = new Vue({
	el: '#wraper',
	data:{
		resourceName:"",/*资源名称*/
		subject:"",
		"discipline_id":-1,/*学科id*/
		"discipline_id2":1,
		"adddiscipline_id":1,
		author_name:"",/*作者*/
		desc:"",/*备注*/
		resource:[],/*上传资源*/
		pic:[],/*缩略图*/
		errorPrompt:"",/*错误描述*/
		subjectList:[],/*学科列表*/
		subjectListqz:[],/*有全部的学科列表*/
		page:1,/*第几页*/
		pages:1,
		sort_type:0,/*排序类型*/
		startdt:"",/*开始时间*/
		enddt:"",/*结束时间*/
		class_type:-1,/*文件类型*/
		key_word:"",/*关键字*/
		tabList:[],
		list:[],
		pageOnline:[],
		curJson:{},
		reqnum:1,
		pathMark:-1,/*查看时路径判断标志*/
		xiangmu:siteRoot,
		curResourceId:-1,
		upIndex:-1,
		sourceFile:null,
		sourceImg:null
		
		
		
	},
	methods:{
		addRe:function(){
			
			formData = new FormData();
			this.resourceName ="";
	    	$("#upResource").val("");
	    	$("#slImg").val("");
	    	this.desc="";
		},
		seeOnline:function(index){
			
			this.curJson=this.tabList[index];
			if(this.curJson.resource_class == 1 || this.curJson.resource_class == 2 || this.curJson.resource_class == 3 || this.curJson.resource_class==4){
				this.pathMark = 1;
				if(this.curJson.resource_class==4){
					return ;
				}
				if(this.curJson.resource_filepath.indexOf("aspx")!=-1){
					return ;
				}
				this.curJson.resource_filepath="https://view.officeapps.live.com/op/embed.aspx?src="+this.curJson.resource_filepath;
				
			}else if(this.curJson.resource_class == 5){
				this.pathMark = 3;
				
			}
			
		},
		vpause:function(){
			if(this.pathMark == 3){
				document.getElementById("myVideo").pause();
			}
			this.curJson = {};
			
		},
		updateOnline:function(index){
			formData = new FormData();
			this.curJson=this.tabList[index];
			this.upIndex=index;
			this.discipline_id2 = this.curJson.resource_disciplineid;
			
		},
		updateSave:function(ev){
			/*修改*/
			
			var _this = ev.currentTarget;
			formData.append("srcid",this.curJson.resource_id)
			formData.append('loginid', $.cookie('uid'));
			formData.append('sessionid', $.cookie('sid'));
			formData.append("author_name", $.cookie('uname'));
			
			
			if(this.curJson.resource_name == ""){
				alert("资源名称不能为空");
				return ;
			}
			if(this.discipline_id2 == ""){
				alert("学科不能为空");
				return ;
			}
			if(this.curJson.resource_desc == ""){
				alert("备注不能为空");
				return ;
			}
			formData.append("discipline_id",this.discipline_id2);
			formData.append("resource_name",this.curJson.resource_name);
			
			formData.append("desc",this.curJson.resource_desc);
			var data = {"1":{command:'onlinesrc/updateresource4node',loginid:$.cookie('uid'),sessionid:$.cookie('sid'),"author_name":$.cookie('uname'),"srcid":this.curJson.resource_id,"discipline_id":this.discipline_id2,"resource_name":this.curJson.resource_name,"desc":this.curJson.resource_desc}}
			
			var url = "/onlinesrc/updateresource4node";
			if(this.sourceImg!==null){
				data["1"].thumbnails_fullname = this.sourceImg.fullname;
				data["1"].thumbnails_group = this.sourceImg.fdfs_group;
				data["1"].thumbnails_path = this.sourceImg.fdfs_path;
			}else{
				data["1"].thumbnails_fullname = '';
				data["1"].thumbnails_group ='';
				data["1"].thumbnails_path ='';
			}
			
			this.post(url,data,this._updateResource,_this);
			//this.loadList();
			
			//this.curJson=this.tabList[this.upIndex];
		},
		deleteOnline:function(){
			
			var url = "/onlinesrc/removeresource";
			var $this = this;
			var data = {
			    "1": {
			        "command": "onlinesrc/removeresource",
			        "loginid" : $.cookie('uid'), 
			        "sessionid": $.cookie('sid'),
			        "srcid" : $this.curResourceId
			    }
			};
			var $this = this;
			this.post(url,data,function(dataDel){
				$("#delModal").modal("hide");
				$this.shModal("删除","删除成功");
			});
			this.loadList();
		},
		shModal:function(oitle,ocontent){
			$("#otherModal-title").html(oitle);
			$("#otherModal-con").html(ocontent);
			$("#otherModal").modal('show');
		},
		uploadOnline:function(ev){
			var _this = ev.currentTarget;
			
			/*新增*/
			formData.append('loginid', $.cookie('uid'));
			formData.append('sessionid', $.cookie('sid'));
			formData.append("author_name", $.cookie('uname'));
			
			if(this.resourceName==""){
				this.errorPrompt="资源名称为必填项";
				return;
			}
			if(this.discipline_id==""){
				this.errorPrompt="学科为必填项";
				return;
			}
			if(this.resource.length==0){
				this.errorPrompt="还没有上传资源";
				return;
			}
			if(this.pic.length==0){
				this.errorPrompt="还没有上传缩略图";
				return;
			}
			if(this.desc==""){
				this.errorPrompt="备注不能为空";
				return;
			}
			_this.disabled=true;
			formData.append("discipline_id",this.adddiscipline_id);
			formData.append("resource_name",this.resourceName);
			
			formData.append("desc",this.desc);
			var data = {"1":{command:'onlinesrc/savepath',loginid:$.cookie('uid'),sessionid:$.cookie('sid'),"author_name":$.cookie('uname'),"discipline_id":this.adddiscipline_id,"resource_name":this.resourceName,"desc":this.desc}}
			
			var url = "/onlinesrc/savepath";
			data["1"].resource_file_size = this.sourceFile.file_size;
			data["1"].resource_fullname = this.sourceFile.fullname;
			data["1"].resource_group = this.sourceFile.fdfs_group;
			data["1"].resource_path = this.sourceFile.fdfs_path;
			data["1"].resource_mimetype = this.sourceFile.file_mimetype;
			data["1"].thumbnails_fullname = this.sourceImg.fullname;
			data["1"].thumbnails_group = this.sourceImg.fdfs_group;
			data["1"].thumbnails_path = this.sourceImg.fdfs_path;
			//this.jsFile(url,$("#myModal"),"添加","添加成功",_this);
			this.post(url,data,this._addResource,_this);
		},
		_addResource:function(json,_this){
			var $this = this;
			if(json["1"].errcode == 9904){
            	parent.window.location.href="/pages/scmp/login.html";
            	formData = new FormData();
            }else if(json["1"].errcode == 0){
            	_this.disabled=false;
            	$("#myModal").modal("hide");
				$this.shModal('添加',"添加成功");
				
				$(".upPross").hide();
				$this.loadList();
				formData = new FormData();
				this.sourceFile =null;
				this.sourceImg = null;
            	//$("#otherModal").modal("show");
            }else{
            	$(".upPross").hide();
            	$("#myModal").modal("hide");
            	$this.shModal("错误提示",json["1"].errdesc);
            	//$("#otherModal").modal("show");
            	formData = new FormData();
            }
		},
		_updateResource:function(json,_this){
			var $this = this;
			if(json["1"].errcode == 9904){
            	parent.window.location.href="/pages/scmp/login.html";
            	formData = new FormData();
            }else if(json["1"].errcode == 0){
            	_this.disabled=false;
            	$("#upModal").modal("hide");
				$this.shModal('修改',"修改成功");
				
				$(".upPross").hide();
				$this.loadList();
				this.curJson=this.tabList[this.upIndex];
				formData = new FormData();
				this.sourceFile =null;
				this.sourceImg = null;
            	//$("#otherModal").modal("show");
            }else{
            	$(".upPross").hide();
            	$("#myModal").modal("hide");
            	$this.shModal("错误提示",json["1"].errdesc);
            	//$("#otherModal").modal("show");
            	formData = new FormData();
            }
		},
		upResource:function(ev){
			this.resource = [];
			var _this = ev.currentTarget;
			this.upFile(_this,"resource");
		},
		upImg:function(ev){
			
			this.pic=[];
			var _this = ev.currentTarget;
			
			var pic = document.getElementById("preview");
			this.upFile(_this,"pic");
			this.picturePreview(_this);
			
		},
		upFile:function(_this,fileName){
			for(var i = 0; i != _this.files.length; i++){
				if(fileName=="resource")this.resource.push(_this.files[i]);
				if(fileName=="pic"){this.pic.push(_this.files[i]);}
				formData.append('file', _this.files[i]);
				this._uploadFile('/file/upload',$("#myModal"),"添加","添加成功",fileName)
			}
			
		},
		picturePreview:function(file){
			var pic = document.getElementById("preview");
			
			 
		    var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();
		 
		     // gif在IE浏览器暂时无法显示
			if(ext!='png'&&ext!='jpg'&&ext!='jpeg'&&ext!='gif'){
				alert("图片的格式必须为png或者jpg或者jpeg格式或者gif"); 
				return;
			}
			var isIE = navigator.userAgent.match(/MSIE/)!= null,
			isIE6 = navigator.userAgent.match(/MSIE 6.0/)!= null;
			 
			if(isIE) {
		        file.select();
		        var reallocalpath = document.selection.createRange().text;
			 
			    // IE6浏览器设置img的src为本地路径可以直接显示图片
				if (isIE6) {
				    pic.src = reallocalpath;
				}else {
				    // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
					pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
					 // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
					pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
				}
			}else {
			    this.html5Reader(file);
			}
		},
		html5Reader:function(file){
			var file = file.files[0];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e){
			    var pic = document.getElementById("preview");
			    pic.src=this.result;
			}
		},
		jsFile:function(url,hideModal,otitle,ocontent,_this){
			var $this = this;
			var xhr = new XMLHttpRequest(); 
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
			            if (xhr.status == 200 || xhr.status == 1){
			                var result = xhr.responseText;
			                var json = eval("(" + result + ")");
			                
			                if(json["1"].errcode == 9904){
			                	parent.window.location.href="/pages/scmp/login.html";
			                	formData = new FormData();
			                }else if(json["1"].errcode == 0){
			                	_this.disabled=false;
			                	hideModal.modal("hide");
								$this.shModal(otitle,ocontent);
								
								$(".upPross").hide();
								$this.loadList();
								formData = new FormData();
			                	//$("#otherModal").modal("show");
			                }else{
			                	$(".upPross").hide();
			                	hideModal.modal("hide");
			                	$this.shModal("错误提示",json["1"].errdesc);
			                	//$("#otherModal").modal("show");
			                	formData = new FormData();
			                }
			            }
			        }

				};
				xhr.upload.addEventListener("progress", function onprogress(evt){
					var loaded = evt.loaded;       //已经上传大小情况 
					var tot = evt.total;
					$("#gray").show();
					$(".upPross").show();
					var upProW = $(".upPross").width()*(loaded/tot);
					$(".upPro").css("width",upProW);
				}, false);
				xhr.open("post", url, true);
				//xhr.setRequestHeader("contentType","text/html;charset=uft-8") //指定发送的编码
  				//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  //设置请求头信息
			    xhr.send(formData);  
		},
		_uploadFile:function(url,hideModal,otitle,ocontent,type){
			var $this = this;
			var xhr = new XMLHttpRequest(); 
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
			            if (xhr.status == 200 || xhr.status == 1){
			                var result = xhr.responseText;
			                var json = eval("(" + result + ")");
			                
			                if(json.code ==200){
			                	
			                	/*hideModal.modal("hide");
								$this.shModal(otitle,ocontent);
								*/
								$(".upPross").hide();
								if(type == "resource"){
									$this.sourceFile = json.data;
								}else{
									$this.sourceImg = json.data;
								}
								
								formData = new FormData();
			                	//$("#otherModal").modal("show");
			                }else{
			                	$(".upPross").hide();
			                	hideModal.modal("hide");
			                	$this.shModal("错误提示",json.message);
			                	//$("#otherModal").modal("show");
			                	formData = new FormData();
			                }
			            }
			        }

				};
				xhr.upload.addEventListener("progress", function onprogress(evt){
					var loaded = evt.loaded;       //已经上传大小情况 
					var tot = evt.total;
					$("#gray").show();
					$(".upPross").show();
					var upProW = $(".upPross").width()*(loaded/tot);
					$(".upPro").css("width",upProW);
				}, false);
				xhr.open("post", url, true);
				//xhr.setRequestHeader("contentType","text/html;charset=uft-8") //指定发送的编码
  				//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  //设置请求头信息
			    xhr.send(formData);  
		},
		
		post:function(url,data,onlineCallback,_this){
			var self = this;
			$.ajax({
				type:"post",
				url:url,
				dataType:"json",
				data:JSON.stringify(data),
				success:function(data2){
					
					if(data2["1"]&&data2["1"].errcode == 9904){
						parent.window.location.href="/pages/scmp/login.html"
					}else if(data2["1"]&&data2["1"].errcode == 0){
						onlineCallback(data2,_this);
					}else if(data2["1"]){
						self.shModal(data2["1"].errdesc);
						_this.disabled = false;
					}else{
						self.shModal(data2.message);
						_this.disabled = false;
					}
					
					
				}
			});
		},
		loadList:function(){/*table*/
			var urlTable ="/onlinesrc/resourcelist";
			var $this = this;
			var dataTable =  {"1": {
		        "command": "onlinesrc/resourcelist",
		        "loginid" : $.cookie('uid'), 
		        "sessionid": $.cookie('sid'),
		        "page" : this.page,
		        "reqnum" : 10,
		        "sort_type" : this.sort_type,
		        "key_word" : this.key_word,
		        "author_name" : this.author_name,
		        "discipline_id" : this.discipline_id,
		        "class_type" : this.class_type,
		        "startdt" : this.startdt,
		        "enddt" : this.enddt
		    }};
		    
			this.post(urlTable,dataTable,function(dataTab){
				$this.tabList=dataTab["1"].list;
				$this.page=dataTab["1"].page;
				$this.pages=dataTab["1"].pages;
				$this.pageList();
			});
			
		},
		searchResource:function(){
			if($('#form-starttime').val()!=""){
				this.startdt = $('#form-starttime').val()+" 00:00:00";
			}
			if($('#form-endtime').val()!=""){
				this.enddt = $('#form-endtime').val()+" 23:59:59";
			}
			
			this.page = 1;
			this.loadList();
		},
		subjectFun:function(){
			/*学科列表*/
			var $this = this;
			var url="/onlinesrc/disciplinelist";
			var data={"1":{"command":"onlinesrc/disciplinelist", "loginid" : $.cookie('uid'), "sessionid": $.cookie('sid')}};
			this.post(url,data,function(data2){
				$this.subjectList=data2["1"].list;
				$this.subjectListqz = data2["1"].list;
				
				$this.subjectListqz.unshift({"discipline_id":-1,"discipline_name":"全部"}); 
				
			});
		},
		pageList:function(){
			var interval = 7;
			this.pageOnline = [];
			if(this.pages<=interval){
				for(var i=1;i<=this.pages;i++){
					this.pageOnline.push(i);
				}
			}else if(this.pages>interval){
				if(this.page<=(interval+1)/2){
					for(var i=1;i<interval-2;i++){
						this.pageOnline.push(i);
					}
					this.pageOnline.push("...");
					this.pageOnline.push(this.pages-1);
					this.pageOnline.push(this.pages);
					
				}else if(this.page>(interval+1)/2 && this.page < this.pages-1){
					this.pageOnline.push(1);
					this.pageOnline.push("...");
					for(var i=this.page-2;i<=this.page+2;i++){
						this.pageOnline.push(i);
					}
					if(this.page+2<this.pages){
						this.pageOnline.push("...");
						this.pageOnline.push(this.pages);
					}
					
				}else if(this.page >=this.pages-1){
					this.pageOnline.push(1);
					this.pageOnline.push("...");
					for(var i=this.pages-(interval-4);i<=this.pages;i++){
						this.pageOnline.push(i);
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
				this.loadList();
			}
			
		}
	},
	mounted:function(){
		this.loadList();
		this.subjectFun();
	},
	filters:{
		resourceClass:function(resource_class){
			if(resource_class==1) return "word";
			if(resource_class==2) return "excel";
			if(resource_class==3) return "ppt";
			if(resource_class==4) return "pdf";
			if(resource_class==5) return "mp4";
		},
		resourceSize:function(resoSize){
			if(resoSize<1024){
				return resoSize+"字节";
			}else if(resoSize >= 1024 && resoSize < 1024*1024){
				return Math.ceil(resoSize/1024)+"kb";
			}else if(resoSize>=1024*1024 && resoSize < 1024*1024*1024){
				return (resoSize/1024/1024).toFixed(2)+"M";
			}else{
				return (resoSize/1024/1024/1024).toFixed(2)+"G";
			}
			
		}
	},
	watch:{
		"pages":function(){
			this.pageOnline=[];
			this.pageList();
		}
	}
});



