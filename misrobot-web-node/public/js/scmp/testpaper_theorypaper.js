
Vue.filter('maintitlenum',function(value){
	var num=value;
	switch (value){
		case 1: num="一";
			break;
		case 2: num="二";
			break;
		case 3: num="三";
			break;
		case 4: num="四";
			break;
		case 5: num="五";
			break;
		case 6: num="六";
			break;
		case 7: num="七";
			break;
		case 8: num="八";
			break;
		case 9: num="九";
			break;
		default:
			break;
	}
	return num;
})
Vue.filter('groupsecondindextransform',function(value){
	var num=value;
	switch (value){
		case 1: num="(一)";
			break;
		case 2: num="(二)";
			break;
		case 3: num="(三)";
			break;
		case 4: num="(四)";
			break;
		case 5: num="(五)";
			break;
		case 6: num="(六)";
			break;
		case 7: num="(七)";
			break;
		case 8: num="(八)";
			break;
		case 9: num="(九)";
			break;
		default:
			break;
	}
	return num;
})
Vue.filter('typetransform',function(value){
	var name=value;
	switch (value){
		case 1: name="单选题";
			break;
		case 2: name="多选题";
			break;
		case 3: name="不定项选择题";
			break;
		case 4: name="判断题";
			break;
		case 5: name="问答题";
			break;
		case 6: name="组合题";
			break;
		case 7: name="osce操作题";
			break;
		case 8: name="learn训练操作题";
			break;
		default:
			break;
	}
	return name;
})
Vue.filter('answertransform',function(value){
	if(value==0){
		return "正确";
	}if(value==1){
		return "错误";
	}else{
		return ' '
	}
})
Vue.filter('ischoosetransform',function(value){
	if(value==0){
		return "加入试卷";
	}if(value==1){
		return "取消加入";
	}else{
		return ' '
	}
})

var vm = new Vue({
	el: '#addnew',
	data: {
		showpageQ:true,//选择题目
		showpageT:false,//编辑试卷
		questionlist:[],//查询全部试题列表
		selectedquestionlist:[],//筛选已选试题列表
		selectedtotalnum:'',//已选题目总数
		questionname:'',//题目名称
		courseid:'',//学科id
//		tag:'',//标签
//		difficult:'',//难度等级
		creator:'',//创建人
		courselist:[],//所属学科列表
		
		papername:'',//试卷名称
		score:'',//试卷总分
		testpapermajorid:'',//试卷所属学科id
		categorylist:[],//试卷题类列表，单选，判断，组合，问答等
		testpaper:[],//试卷对象
		
		//弹出窗口
		changepapernameshow:false,//更名pop
		oldpapername:'',//旧的试卷名称
		setscoreshow:false,//设置总分
		oldscore:'',//旧的总分
		scorelimit:0,//总分满分限制 0限制 1不限制
		setquestionscoreshow:false,//设置题目分值pop
		questionscore:'',
		
		pageconf: {
			itemsPerPage:10,//默认显示10条
			current: 1, //默认显示第一页
			showItem: 10, //最多显示多少页，自己定义
			allpage: '', //总共多少页，根据请求返回结果计算
			totalnum: '', //总共条数，请求返回
			name:'',//题目名称
			type: 0,//试题idquestiontypeid 1:单选 2:多选 3:不定项选择题 4:判断题 5:问答题 6:组合题 7:osce操作题 8:learn训练操作题 0:理论试卷
			person:'',//创建人
			subject:'',//所属学科
			value1: 0,//已加入：1；全部：0 默认查询全部
			onchange: function(index,itemsperpage,name,type,person,subject,value1) { 
				if(value1==0){//查询全部
					var data = {
						command:"exampaper/queryquestionlist",
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						page:index,
						reqnum:itemsperpage,
						paperid:location.href.split('=')[1],//试卷id
						questiontypeid:type,
						questionname:name,
						courseid:subject,
	//					tag:'',
	//					difficult:'',
						creator:person,
					};
					function callback(res) {
						vm.questionlist=res.questionlist;
						vm.pageconf.totalnum=res.allcount;
						vm.pageconf.allpage = Math.ceil(res.allcount / itemsperpage);
					};
					post("/exampaper/queryquestionlist", data, callback, errcodefn, errfn)
				}
				if(value1==1){//查询已加入
					var data = {
						command:"exampaper/queryselectedquestion",
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						page:index,
						reqnum:itemsperpage,
						paperid:location.href.split('=')[1],//试卷id
						questiontypeid:type,
						questionname:name,
						courseid:subject,
	//					tag:'',
	//					difficult:'',
						creator:person,
					};
					function callback(res) {
						vm.questionlist=res.questionlist;console.log('-------------'+JSON.stringify(vm.questionlist))
						vm.pageconf.totalnum=res.allcount;
						vm.pageconf.allpage = Math.ceil(res.allcount / itemsperpage);
					};
					post("/exampaper/queryselectedquestion", data, callback, errcodefn, errfn)
				}
			}
		},
	},
	mounted:function(){
		this.pageconf.onchange(1,10,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject,this.pageconf.value1);
		this.queryCourse();
		this.queryselectedtotalnum();
		var edit=location.href.split('=')[2];
		if (edit==='edit') {
			this.nextEdit();
		}
	},
	methods: {
		goback:function(){//返回
			window.history.go(-1)
		},
		querypapername:function(){//查询试卷信息
			var self=this
            var data={
                command:"exampaper/viewpaper",
                sessionid:getCookie('sid'),
                loginid:getCookie('uid'),
				paperid:location.href.split('=')[1],
            }
            function callback(res){
            	vm.papername=res.paperinfo.name;
            	vm.score=res.paperinfo.score;
            	vm.testpapermajorid=res.paperinfo.majorid;
            }
            post("/exampaper/viewpaper",data,callback,errcodefn,errfn)
		},
		queryselectedtotalnum:function(){//查询已选择题目总数
			var data = {
				command:"exampaper/queryselectedquestion",
				sessionid:getCookie('sid'),
				loginid:getCookie('uid'),
				paperid:location.href.split('=')[1],//试卷id
				questiontypeid:0,
			};
			function callback(res) {
				vm.selectedtotalnum=res.allcount;
			};
			post("/exampaper/queryselectedquestion", data, callback, errcodefn, errfn)
		},
		queryCourse:function(){//查询学科列表
            var data={
                command:"cls/selectCourses",
                sessionid:getCookie('sid'),
                loginid:getCookie('uid')
            }
            function callback(res){
            	vm.courselist=res.courseslist;
            }
            post("/cls/selectCourses",data,callback,errcodefn,errfn)
		},
		allquestion:function(){//查询全部试题
			this.pageconf.value1=0;
			this.pageconf.current=1;
			this.pageconf.type=0;
			this.pageconf.onchange(this.pageconf.current,this.pageconf.itemsPerPage,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject,this.pageconf.value1);
		},
		selectedquestion:function(){//查询已选试题
			this.pageconf.value1=1;
			this.pageconf.current=1;
			this.pageconf.type=0;
			this.pageconf.onchange(this.pageconf.current,this.pageconf.itemsPerPage,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject,this.pageconf.value1);
		},
		search:function(){//筛选试题
			this.pageconf.current=1;
			this.pageconf.onchange(this.pageconf.current,this.pageconf.itemsPerPage,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject,this.pageconf.value1);
		},
		checkquestion:function(type,questionbaseid){//查看试题
			if(type == 1) {
				layer.open({
					type: 2,
					title: '查看题目-单选题',
					area: ['100%', '100%'],
					shadeClose: true,
					content: './look-danxuan.html?id=' + questionbaseid
				})
			} else if(type == 2) {
				layer.open({
					type: 2,
					title: '查看题目-多选题',
					area: ['100%', '100%'],
					shadeClose: true,
					content: './look-duoxuan.html?id=' + questionbaseid
				})
			} else if(type == 4) {
				layer.open({
					type: 2,
					title: '查看题目-判断题',
					area: ['100%', '100%'],
					shadeClose: true,
					content: './look-panduan.html?id=' + questionbaseid
				})
			} else if(type == 5) {
				layer.open({
					type: 2,
					title: '查看题目-问答题',
					area: ['100%', '100%'],
					shadeClose: true,
					content: './look-wenda.html?id=' + questionbaseid
				})
			} else if(type == 6) {
				layer.open({
					type: 2,
					title: '查看题目-组合题',
					area: ['100%', '100%'],
					shadeClose: true,
					content: './look-zuhe.html?id=' + questionbaseid
				})
			} else if(type == 7) {
				layer.open({
					type: 2,
					title: '查看题目-操作题',
					area: ['100%', '100%'],
					shadeClose: true,
					content: './look-caozuo.html?id=' + questionbaseid
				})
			}
		},
		combinationaddtopaper:function(arr,typeid,questionid){//组合题加入试卷
			console.log(JSON.stringify(arr),typeid,questionid)
			var data={
				command:"exampaper/joinpaperquestion",
				sessionid:getCookie("sid"),
				loginid:getCookie("uid"),
				paperid:location.href.split('=')[1],
				cateid:typeid,
				questionid:questionid,
				assquestion:arr
			}
			function callback(res){
				if( res.errcode==0 ){
					vm.pageconf.onchange(vm.pageconf.current,vm.pageconf.itemsPerPage,vm.pageconf.name,vm.pageconf.type,vm.pageconf.person,vm.pageconf.subject,vm.pageconf.value1);
					vm.queryselectedtotalnum();
					layer.msg('添加试卷成功!');
					return false;
				}
			}
			post("/exampaper/joinpaperquestion",data,callback,errcodefn,errfn)
		},
		add_canceltopaper:function(typeid,questionid,ischoose){//加入或者取消加入试卷
			if (ischoose==0) {//加入试卷
				if (typeid==6) {//组合题
					//查询组合题内部题目id
					var data={
						command:"question/querycombinationquestion",
						sessionid:getCookie("sid"),
						loginid:getCookie("uid"),
						questionbaseid:questionid
					}
					function callback(res){
						var insidearr=[];//内部题目id数组
						for (var i=0;i<res.subitem.length;i++) {
							insidearr.push({
								questionsubid:res.subitem[i].itemid
							});
						}console.log('------组合题内部题目id------'+JSON.stringify(insidearr))
						vm.combinationaddtopaper(insidearr,typeid,questionid);//组合题加入试卷
					}
					post("/question/querycombinationquestion",data,callback,errcodefn,errfn)
				} else{//非组合题
					var data={
						command:"exampaper/joinpaperquestion",
						sessionid:getCookie("sid"),
						loginid:getCookie("uid"),
						paperid:location.href.split('=')[1],
						cateid:typeid,
						questionid:questionid
					}
					function callback(res){
						if( res.errcode==0 ){
							vm.pageconf.onchange(vm.pageconf.current,vm.pageconf.itemsPerPage,vm.pageconf.name,vm.pageconf.type,vm.pageconf.person,vm.pageconf.subject,vm.pageconf.value1);
							vm.queryselectedtotalnum();
							layer.msg('添加试卷成功!');
							return false;
						}
					}
					post("/exampaper/joinpaperquestion",data,callback,errcodefn,errfn)
				}
			} else{//取消加入试卷
				console.log('-----questionid取消加入试卷------'+questionid)
				var data={
					command:"exampaper/cancelpaperquestion",
					sessionid:getCookie("sid"),
					loginid:getCookie("uid"),
					paperid:location.href.split('=')[1],
					questionid:questionid
				}
				function callback(res){
					if( res.errcode==0 ){
						vm.pageconf.onchange(vm.pageconf.current,vm.pageconf.itemsPerPage,vm.pageconf.name,vm.pageconf.type,vm.pageconf.person,vm.pageconf.subject,vm.pageconf.value1);
						vm.queryselectedtotalnum();
						layer.msg('取消加入试卷成功!');
						return false;
					}
				}
				post("/exampaper/cancelpaperquestion",data,callback,errcodefn,errfn)
			}
			
		},	
		nextEdit:function(){//下一步
			this.testpaper=[];
			this.categorylist=[];
			this.querypapername();
			var data={
				command:"exampaper/querypapercategorylist",
				sessionid:getCookie("sid"),
				loginid:getCookie("uid"),
				paperid:location.href.split('=')[1],
			}
			function callback(res){
				vm.categorylist=res.categoryList;
				vm.showpageQ=false;
				vm.showpageT=true;
				$(".boxt").removeClass("boxSelected");
				$(".boxb").addClass("boxSelected");
			}
			post("/exampaper/querypapercategorylist",data,callback,errcodefn,errfn)
		},
		backSelect:function(){//上一步
				this.showpageQ=true;
				this.showpageT=false;
				$(".boxt").addClass("boxSelected");
				$(".boxb").removeClass("boxSelected");
			
		},
		savetestpaper:function(){//保存试卷
			console.log('-----------保存试卷-----------------'+JSON.stringify(this.testpaper))
			var papermainlist=[];
			var allscore=0;
			for(var i=0;i<this.testpaper.length;i++){
				var mainobj=this.testpaper[i];
				var questionlist=[];
				if (mainobj.cateid==6) {//组合题
					for (var j=0;j<mainobj.content.length;j++) {
						var obj=mainobj.content[j];
						var questionitemlist=[];
						if (obj.grouplist!=null) {
							for (var k=0;k<obj.grouplist.length;k++) {
								var littleobj=obj.grouplist[k];
								if (littleobj.score==null) {
									layer.msg('请设置题目分数!');
									return false;
								}
								questionitemlist.push({
									id:littleobj.id,
									questionitemid:littleobj.questionbaseid,
									score:littleobj.score,
									priority:littleobj.priority
								})
							}
						}
						questionlist.push({
							id:obj.id,
							questionbaseid:obj.questionbaseid,
							score:obj.score,
							priority:obj.priority,
							questionItemList:questionitemlist
						})
					}
				}else{//其它
					for (var j=0;j<this.testpaper[i].content.length;j++) {
						var obj=this.testpaper[i].content[j];
						if (obj.score==null) {
							layer.msg('请设置题目分数!');
							return false;
						}
						questionlist.push({
							id:obj.id,
							questionbaseid:obj.questionbaseid,
							score:obj.score,
							priority:obj.priority
						})
					}
				}
				if (mainobj.totalscore==null) {
					layer.msg('请设置题目分数!');
					return false;
				}
				allscore+=mainobj.totalscore;
				if (mainobj.scoresettype==1) {
					papermainlist.push({
						id:mainobj.id,
						nickname:mainobj.nickname,
						cateid:mainobj.cateid,
						scoresettype:mainobj.scoresettype,
						score:mainobj.score,
						priority:mainobj.priority,
						questionlist:questionlist
					})
				}else{
					papermainlist.push({
						id:mainobj.id,
						nickname:mainobj.nickname,
						cateid:mainobj.cateid,
						scoresettype:mainobj.scoresettype,
						priority:mainobj.priority,
						questionlist:questionlist
					})
				}
				
			}
			if (this.scorelimit==0) {//满分限制
				if (this.score==null) {
					layer.msg('请设置试卷分数!');
					return false;
				}else{
					if (this.score!=allscore) {
						layer.msg('各小题分值和不等于总分')
						return false;
					}
				}
			}
			var data={
				command:"exampaper/updatepaper",
				sessionid:getCookie("sid"),
				loginid:getCookie("uid"),
				paperid:location.href.split('=')[1],
				name:this.papername,
				score:this.score,
				type:1,
				majorid:this.testpapermajorid,
				scorenolimit:this.scorelimit,
				papermainlist:papermainlist
			}
			function callback(res){
				if (res.errcode==0) {
//					window.location.assign("./testpaperManage.html") 
					layer.msg('试卷保存成功!');
					return false;
				}
				console.log(res)
			}
			post("/exampaper/updatepaper",data,callback,errcodefn,errfn)
		},
		querypaperquestion:function(mainid,cateid,totalnum,nickname,scoresettype,score,totalscore,priority){//查询试题详情并拼接试卷对象
			var data={
				command:"exampaper/querypaperquestion",
				sessionid:getCookie("sid"),
				loginid:getCookie("uid"),
				paperid:location.href.split('=')[1],
				mainid:mainid,
				cateid:cateid
			}
			function callback(res){console.log('--------cateid----------'+cateid)
				if(cateid==6){//如果cateid是组合题
					var questionlist=[];
					for (var i=0;i<res.questionlist.length;i++) {
						var grouplist=res.questionlist[i].grouplist;
						if (grouplist!=null) {
							for (var a=0;a<grouplist.length;a++) {//三级题目排序
								for (var b=a+1;b<grouplist.length;b++) {
									if (grouplist[a].priority>grouplist[b].priority) {
										var obj=grouplistsort[a];
										grouplist[a]=grouplist[b];
										grouplist[b]=obj;
									}
								}
							}
							for (var a=0;a<grouplist.length;a++) {//三级题目排序
								grouplist[a].priority=a;
							}
						}
						
						questionlist.push({
							id:res.questionlist[i].id,
							questionbaseid:res.questionlist[i].questionbaseid,
							score:res.questionlist[i].score,
							priority:res.questionlist[i].priority,
							mainid:res.questionlist[i].mainid,
							paperid:res.questionlist[i].paperid,
							questionbasename:res.questionlist[i].questionbasename,
							questionitem:res.questionlist[i].questioinitem,
							answer:res.questionlist[i].answer,
							grouplist:grouplist
						})
					}
					for (var i=0;i<questionlist.length;i++) {//二级题目排序
						for (var j=i+1;j<questionlist.length;j++) {
							if (questionlist[i].priority>questionlist[j].priority) {
								var obj=questionlist[i];
								questionlist[i]=questionlist[j];
								questionlist[j]=obj;
							}
						}
					}
					for (var i=0;i<questionlist.length;i++) {//二级题目排序
						questionlist[i].priority=i;
					}
					if (cateid==5||cateid==6) {
						scoresettype=0;
					}
					vm.testpaper.push({
						id:mainid,
						cateid:cateid,//题类
						totalnum:totalnum,//试题总数
						nickname:nickname,//分类名称
						scoresettype:scoresettype,//是否统一设置
						score:score,//试题分值
						totalscore:totalscore,//试题总分值
						priority:priority,//排序
						content:questionlist//题类下属小题数组
					});
					vm.sorttestpaper();//一级题目排序
				}else{
					for (var i=0;i<res.questionlist.length;i++) {//二级题目排序
						for (var j=i+1;j<res.questionlist.length;j++) {
							if (res.questionlist[i].priority>res.questionlist[j].priority) {
								var obj=res.questionlist[i];
								res.questionlist[i]=res.questionlist[j];
								res.questionlist[j]=obj;
							}
						}
					}
					for (var i=0;i<res.questionlist.length;i++) {//二级题目排序
						res.questionlist[i].priority=i;
					}
					if (cateid==5||cateid==6) {
						scoresettype=0;
					}
					vm.testpaper.push({
						id:mainid,
						cateid:cateid,//题类
						totalnum:totalnum,//试题总数
						nickname:nickname,//分类名称
						scoresettype:scoresettype,//是否统一设置
						score:score,//试题分值
						totalscore:totalscore,//试题总分值
						priority:priority,//排序
						content:res.questionlist//题类下属小题数组
					});
					vm.sorttestpaper();//一级题目排序
				}
			}
			post("/exampaper/querypaperquestion",data,callback,errcodefn,errfn)
		},
		sorttestpaper:function(){//排序
			for (var i=0;i<this.testpaper.length;i++) {
				for (var j=i+1;j<this.testpaper.length;j++) {
					if (this.testpaper[i].priority>this.testpaper[j].priority) {
						var obj=this.testpaper[i];
						this.testpaper[i]=this.testpaper[j];
						this.testpaper[j]=obj;
					}
				}
			}
			for (var i=0;i<this.testpaper.length;i++) {
				this.testpaper[i].priority=i;
			}
//			console.log('------------------------sort----------------------------'+JSON.stringify(this.testpaper))
		},
		/***********************************************编辑试卷操作***********************************************************/
		closePop:function(){//关闭pop
			this.setscoreshow=false;
			this.changepapernameshow=false;
			this.setquestionscoreshow=false;
		},
		changepapername:function(){//更名pop
			console.log('-----更名----------')
//			this.oldpapername=this.papername;
			this.changepapernameshow=true;
		},
		surechangepapername:function(){//确定更名
			this.changepapernameshow=false;
		},
		settotalscore:function(){//设置总分
			this.oldscore=this.score;
			this.setscoreshow=true;
		},
		suresettotalscore:function(){//确认设置总分
			if(this.scorelimit==0){//满分限制
				var allscore=0;
				for(var i=0;i<this.testpaper.length;i++){
					if (this.testpaper[i].totalscore!=null) {
						allscore+=parseFloat(this.testpaper[i].totalscore)
					}
				}
				if (this.score!=allscore) {
					layer.msg("各题分值总和不等于满分!")
				}
				if (this.score<0) {
					var num=this.score;
					this.score=0-num;
					layer.msg("设置分值不可小于0!");
				}
			}else{//无满分限制
				this.score=0;
				for(var i=0;i<this.testpaper.length;i++){
					if (this.testpaper[i].totalscore!=null) {
						this.score+=parseFloat(this.testpaper[i].totalscore)
					}
				}
			}
			this.setscoreshow=false;
		},
		setquestionscore:function(index){//一级题统一设置二级题每道题分值
			var obj=this.testpaper[index];
			if (obj.score<0) {
				var num=obj.score;
				obj.score=0-num;
				layer.msg("设置分值不可小于0!");
			}
			obj.totalscore=obj.totalnum*obj.score;console.log('---------score-------'+obj.socre,obj.totalscore)
			for (var i=0;i<obj.content.length;i++) {
				obj.content[i].score=obj.score;
			}
		},
		setlittlescore:function(index,mainindex){//分别设置分值
			var obj=this.testpaper[index];
			if (obj.content[mainindex].score<0) {
				var num=obj.content[mainindex].score;
				obj.content[mainindex].score=0-num;
				layer.msg("设置分值不可小于0!");
			}
			obj.totalscore=0;
			for (var i=0;i<obj.content.length;i++) {
				if(obj.content[i].score!=null){
					obj.totalscore+=parseFloat(obj.content[i].score);
				}
			}
		},
		setgrouplittlescore:function(index,mainindex,groupindex){//分别设置组合题分值
			var obj=this.testpaper[index];console.log('---组合题---',index,mainindex,groupindex)
			if (obj.content[mainindex].grouplist[groupindex].score<0) {
				var num=obj.content[mainindex].grouplist[groupindex].score;
				obj.content[mainindex].grouplist[groupindex].score=0-num;
				layer.msg("设置分值不可小于0!");
			}
			obj.totalscore=0;
			for (var i=0;i<obj.content.length;i++) {
				var secondobj=obj.content[i];
				secondobj.score=0;
				for (var j=0;j<secondobj.grouplist.length;j++) {
					if (secondobj.grouplist[j].score!=null) {
						if (secondobj.grouplist[j].score<0) {
							layout.msg('分值设置必须大于0！')
							secondobj.grouplist[j].content[i].score=0;
							return false
						}
						secondobj.score+=parseFloat(secondobj.grouplist[j].score)
					}
				}
				obj.score=parseFloat(secondobj.score);
				obj.totalscore=obj.totalnum*obj.score;
			}
		},
		deletebtn:function(index,mainindex){//删除题目 
			console.log('-----questionid取消加入试卷------')
			var questionid=this.testpaper[index].content[mainindex].questionbaseid;
			var data={
				command:"exampaper/cancelpaperquestion",
				sessionid:getCookie("sid"),
				loginid:getCookie("uid"),
				paperid:location.href.split('=')[1],
				questionid:questionid
			}
			function callback(res){
				if (res.errcode==0) {
					vm.deleteinarr(index,mainindex);
				}
			}
			post("/exampaper/cancelpaperquestion",data,callback,errcodefn,errfn)
			
		},
		deleteinarr:function(index,mainindex){//从队列中删除题目
			console.log('---------删除题目------------'+index,mainindex)
			var obj=this.testpaper[index].content;
			var arr=[];
			if (this.testpaper[index].totalnum>0) {
				console.log(this.tespaper[index].totalnum)
			}
			for (var i=0;i<obj.length;i++) {
				if (i!=mainindex) {
					arr.push(obj[i])
				}
			}
			this.testpaper[index].content=arr;
			if (this.testpaper[index].content.length==0) {
				var testpaperarr=[];
				for (var i=0;i<this.testpaper.length;i++) {
					if (i!=index) {
						testpaperarr.push(this.testpaper[i])
					}
				}
				this.testpaper=testpaperarr;
			}
		},
		upquestion:function(index){//大题向上移
			var arr=this.testpaper;
			var obj=arr[index];
			obj.priority=index-1;
			arr[index-1].priority=index;
			arr[index]=arr[index-1];
			arr[index-1]=obj;
			this.testpaper=[];
			this.testpaper=this.testpaper.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
		},
		downquestion:function(index){//大题向下移
			var arr=this.testpaper;
			var obj=arr[index];
			obj.priority=index+1;
			arr[index+1].priority=index;
			arr[index]=arr[index+1];
			arr[index+1]=obj;
			this.testpaper=[];
			this.testpaper=this.testpaper.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
		},
		uplittlequestion:function(index,mainindex){//二级题向上移
			var arr=this.testpaper[index].content;
			var obj=arr[mainindex];
			obj.priority=mainindex-1;
			arr[mainindex-1].priority=mainindex;
			arr[mainindex]=arr[mainindex-1];
			arr[mainindex-1]=obj;
			this.testpaper[index].content=[];
			this.testpaper[index].content=this.testpaper[index].content.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
		},
		downlittlequestion:function(index,mainindex){//二级题向下移
			var arr=this.testpaper[index].content;
			var obj=arr[mainindex];
			obj.priority=mainindex+1;
			arr[mainindex+1].priority=mainindex;
			arr[mainindex]=arr[mainindex+1];
			arr[mainindex+1]=obj;
			this.testpaper[index].content=[];
			this.testpaper[index].content=this.testpaper[index].content.concat(arr);console.log('-----------'+JSON.stringify(this.testpaper))
		},
		upminiquestion:function(index,mainindex,groupindex){//三级题向上移
			console.log('-----三级上移'+index,mainindex,groupindex)
			var arr=this.testpaper[index].content[mainindex].grouplist;
			var obj=arr[groupindex];
			obj.priority=groupindex-1;
			arr[groupindex-1].priority=groupindex;
			arr[groupindex]=arr[groupindex-1];
			arr[groupindex-1]=obj;
			this.testpaper[index].content[mainindex].grouplist=[];
			this.testpaper[index].content[mainindex].grouplist=this.testpaper[index].content[mainindex].grouplist.concat(arr);
		},
		downminiquestion:function(index,mainindex,groupindex){//三级题向下移
			console.log('-----三级下移'+index,mainindex,groupindex)
			var arr=this.testpaper[index].content[mainindex].grouplist;
			var obj=arr[groupindex];
			obj.priority=groupindex+1;
			arr[groupindex+1].priority=groupindex;
			arr[groupindex]=arr[groupindex+1];
			arr[groupindex+1]=obj;
			this.testpaper[index].content[mainindex].grouplist=[];
			this.testpaper[index].content[mainindex].grouplist=this.testpaper[index].content[mainindex].grouplist.concat(arr);
		}
	},
	watch:{
		categorylist:function(newcategorylist){//监听mainid
//			console.log('-----categorylist----'+JSON.stringify(this.categorylist))
			for(var i=0;i<this.categorylist.length;i++){console.log('--------'+i)
				this.querypaperquestion(this.categorylist[i].id,this.categorylist[i].cateid,this.categorylist[i].totalnum,this.categorylist[i].nickname,this.categorylist[i].scoresettype,this.categorylist[i].score,this.categorylist[i].totalscore,this.categorylist[i].priority);
			}
		}
	},
	computed: {
		pages: function() {
			var pag = [];
			if(this.pageconf.current < this.pageconf.showItem) { //如果当前的激活的项 小于要显示的条数
				//总页数和要显示的条数那个大就显示多少条
				var i = Math.min(this.pageconf.showItem, this.pageconf.allpage);
				while(i) {
					pag.unshift(i--);
				}
			} else { //当前页数大于显示页数了
				var middle = this.pageconf.current - Math.floor(this.pageconf.showItem / 2), //从哪里开始
					i = this.pageconf.showItem;
				if(middle > (this.pageconf.allpage - this.pageconf.showItem)) {
					middle = (this.pageconf.allpage - this.pageconf.showItem) + 1
				}
				while(i--) {
					pag.push(middle++);
				}
			}
			return pag
		}
	},
});




