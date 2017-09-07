
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
		default:
			break;
	}
	return num;
})
Vue.filter('typetransform',function(value){
	var name=value;
	switch (value){
		case 1: name="单选";
			break;
		case 2: name="多选";
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
		showpageT:false,//设置分值
		questionlist:[],//查询全部试题列表
		selectedquestionlist:[],//筛选已选试题列表
		selectedtotalnum:'',//已选题目总数
		questionname:'',//题目名称
		courseid:'',//学科id
//		tag:'',//标签
//		difficult:'',//难度等级
		creator:'',//创建人
		courselist:[],//所属学科列表
		grade:0,//设置总分 默认100	
		score:'',//设置分值
		updatescore:0,//当前分已设置分值
		scorelist:[],//分值列表
		resetgrade:false,//是否重新设置分值
		pageconf: {
			itemsPerPage:10,//默认显示10条
			current: 1, //默认显示第一页
			showItem: 10, //最多显示多少页，自己定义
			allpage: '', //总共多少页，根据请求返回结果计算
			totalnum: '', //总共条数，请求返回
			name:'',//题目名称
			type: 0,//已加入：1；全部：0 默认查询全部
			person:'',//创建人
			subject:'',//所属学科
			onchange: function(index,itemsperpage,name,type,person,subject) { 
				if(type==0){//查询全部
					var data = {
						command:"exampaper/queryquestionlist",
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						page:index,
						reqnum:itemsperpage,
						paperid:location.href.split('=')[1],//试卷id
						questiontypeid:7,
						questionname:name,
						courseid:subject,
						creator:person
					};
					function callback(res) {
						vm.questionlist=res.questionlist;
						vm.pageconf.totalnum=res.allcount;
						vm.pageconf.allpage = Math.ceil(res.allcount / itemsperpage);
					};
					post("/exampaper/queryquestionlist", data, callback, errcodefn, errfn)
				}
				if(type==1){//查询已加入
					var data = {
						command:"exampaper/queryselectedquestion",
						sessionid:getCookie('sid'),
						loginid:getCookie('uid'),
						page:index,
						reqnum:itemsperpage,
						paperid:location.href.split('=')[1],//试卷id
						questiontypeid:7,
						questionname:name,
						courseid:subject,
						creator:person
					};
					function callback(res) {
						vm.questionlist=res.questionlist;
						vm.pageconf.totalnum=res.allcount;
						vm.pageconf.allpage = Math.ceil(res.allcount / itemsperpage);
					};
					post("/exampaper/queryselectedquestion", data, callback, errcodefn, errfn)
				}
			}
		},
	},
	mounted:function(){
		this.pageconf.onchange(1,10,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject);
		this.queryCourse();
		this.queryselectedtotalnum();
	},
	methods: {
		goback:function(){//返回
			window.history.go(-1)
		},
		queryselectedtotalnum:function(){//查询已选择题目总数
			var data = {
				command:"exampaper/queryselectedquestion",
				sessionid:getCookie('sid'),
				loginid:getCookie('uid'),
				paperid:location.href.split('=')[1],//试卷id
				questiontypeid:7,
			};
			function callback(res) {
				vm.selectedtotalnum=res.allcount;
			};
			post("/exampaper/queryselectedquestion", data, callback, errcodefn, errfn)
		},
		queryCourse:function(){//查询学科列表
			var self=this
            var data={
                command:"cls/selectCourses",
                sessionid:getCookie('sid'),
                loginid:getCookie('uid')
            }
            function callback(res){
            	self.courselist=res.courseslist;
            }
            post("/cls/selectCourses",data,callback,errcodefn,errfn)
		},
		allquestion:function(){//查询全部试题
			this.pageconf.type=0;
			this.pageconf.current=1;
			this.pageconf.onchange(this.pageconf.current,this.pageconf.itemsPerPage,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject);
		},
		selectedquestion:function(){//查询已选试题
			this.pageconf.type=1;
			this.pageconf.current=1;
			this.pageconf.onchange(this.pageconf.current,this.pageconf.itemsPerPage,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject);
		},
		search:function(){//筛选试题
			this.pageconf.current=1;
			this.pageconf.onchange(this.pageconf.current,this.pageconf.itemsPerPage,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject);
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
		add_canceltopaper:function(typeid,questionid,ischoose){//加入或者删除试卷
			if (ischoose==0) {//加入试卷
				var data={
					command:"exampaper/joinpaperquestion",
					sessionid:getCookie("sid"),
					loginid:getCookie("uid"),
					paperid:location.href.split('=')[1],
					cateid:typeid,
					questionid:questionid
				}
				function callback(res){
					console.log(res)
					if( res.errcode==0 ){
						vm.pageconf.onchange(vm.pageconf.current,vm.pageconf.itemsPerPage,vm.pageconf.name,vm.pageconf.type,vm.pageconf.person,vm.pageconf.subject);
						vm.queryselectedtotalnum();
						layer.msg('添加试卷成功!');
						return false;
					}else{
						layer.msg('添加试卷失败!');
						return false;
					}
				}
				post("/exampaper/joinpaperquestion",data,callback,errcodefn,errfn)
			} else{//取消加入试卷
				var data={
					command:"exampaper/cancelpaperquestion",
					sessionid:getCookie("sid"),
					loginid:getCookie("uid"),
					paperid:location.href.split('=')[1],
					questionid:questionid
				}
				function callback(res){
					console.log(res)
					if( res.errcode==0 ){
						vm.pageconf.onchange(vm.pageconf.current,vm.pageconf.itemsPerPage,vm.pageconf.name,vm.pageconf.type,vm.pageconf.person,vm.pageconf.subject);
						vm.queryselectedtotalnum();
						layer.msg('取消加入试卷成功!');
						return false;
					}else{
							layer.msg('添加试卷失败!');
							return false;
						}
				}
				post("/exampaper/cancelpaperquestion",data,callback,errcodefn,errfn)
			}
			
		},	
		nextEdit:function(){//下一步
			var data = {
				command:"exampaper/queryselectedquestion",
				sessionid:getCookie('sid'),
				loginid:getCookie('uid'),
				paperid:location.href.split('=')[1],//试卷id
				questiontypeid:7,
			};
			function callback(res) {console.log('-----已选操作题----'+JSON.stringify(res.questionlist))
				vm.selectedquestionlist=[];
				vm.selectedquestionlist=res.questionlist;
				vm.updatescore=0;
				for (var i=0;i<vm.selectedquestionlist.length;i++) {
					if (vm.selectedquestionlist[i].score==null) {
						vm.selectedquestionlist[i].score=0
					}
					vm.updatescore+=parseFloat(vm.selectedquestionlist[i].score);
				}
				vm.grade=vm.updatescore;
				vm.showpageQ=false;
				vm.showpageT=true;
				$(".boxt").removeClass("boxSelected");
				$(".boxb").addClass("boxSelected");
			};
			post("/exampaper/queryselectedquestion", data, callback, errcodefn, errfn)
		},
		backSelect:function(){//返回
			this.grade=0;
			this.showpageQ=true;
			this.showpageT=false;
			$(".boxt").addClass("boxSelected");
			$(".boxb").removeClass("boxSelected");
		},
		save:function(){//保存
			var scorelist=[];
			for (var i=0;i<this.selectedquestionlist.length;i++) {console.log(JSON.stringify(this.selectedquestionlist[i].id))
				scorelist.push({
					id:this.selectedquestionlist[i].id,
					score:this.selectedquestionlist[i].score,
					questionbaseid:this.selectedquestionlist[i].questionbaseid
				})
			}
			if (this.grade!=this.updatescore) {
				layer.msg('当前分值不等于设置总分！')
				return false;
			}
			var data={
				command:"exampaper/operatquestionscore",
				sessionid:getCookie("sid"),
				loginid:getCookie("uid"),
				paperid:location.href.split('=')[1],
				cateid:7,
				scoreall:this.grade,
				questionlist:scorelist,
			}
			function callback(res){
				if (res.errcode==0) {
					window.location.assign("./testpaperManage.html")
					layer.msg('保存成功！');
					return false;
				}
			}
			post("/exampaper/operatquestionscore",data,callback,errcodefn,errfn)
		},
		cancel:function(){//取消
			this.grade=0;
			window.location.assign("./testpaperManage.html")
		},
		inputFn:function(score,id,baseid){//监听分值设置 分值加入scorelist
			this.updatescore=0;
			console.log('----updatescore1111111111----'+JSON.stringify(this.selectedquestionlist))
			
			for (var i=0;i<this.selectedquestionlist.length;i++) {
				if (this.selectedquestionlist[i].score==null||this.selectedquestionlist[i].score=='') {
					this.selectedquestionlist[i].score=0;
				}
				this.updatescore+=parseFloat(this.selectedquestionlist[i].score);
			}
			if(this.updatescore>this.grade){
//				this.grade=this.updatescore;
				this.resetgrade=true;
//				layer.msg('当前分值大于设置分值，请重新设置分值！');
				return false;
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




