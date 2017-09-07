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
Vue.filter('typetransform',function(value){
	if(value==1){
		return "理论考试";
	}if(value==2){
		return "操作考试";
	}if(value==3){
		return "理论题库";
	}if(value==4){
		return "操作题库";
	}else{
		return ''
	}
})
var vm = new Vue({
	el:"#testpaperManage",
	data:{
		addnewshow:false,
		checkbtnboxshow:false,
		paperlist:[],//试卷查询列表
		starttime:'',//开始时间
		endtime:'',//结束时间
		courselist:[],//所属学科列表
		addtesttype:'',//新增类型
		addtestname:'',//新增名称
		addmajorid:'',//所属学科
		pageconf: {
			itemsPerPage:10,//默认显示10条
			current: 1, //默认显示第一页
			showItem: 10, //最多显示多少页，自己定义
			allpage: '', //总共多少页，根据请求返回结果计算
			totalnum: '', //总共条数，请求返回
			name:'',//试卷名称
			type:'',//试卷类型
			person:'',//操作人
			subject:'',//所属学科
			onchange: function(index,itemsperpage,name,type,person,subject,starttime,endtime) { 
				var data = {
					command:"exampaper/querypaper",
					sessionid:getCookie('sid'),
					loginid:getCookie('uid'),
					page:index,
					reqnum:itemsperpage,
					name:name,
					type:type,
					majorid:subject,
					operater:person,
					starttime:starttime,
					endtime:endtime
				};
				function callback(res) {
					vm.paperlist=res.paperlist;
					vm.pageconf.totalnum=res.totalcount;
					vm.pageconf.allpage = Math.ceil(res.totalcount / itemsperpage);
				};
				post("/exampaper/querypaper", data, callback, errcodefn, errfn)
			}
		},
	},
	mounted:function(){
		this.paperlist='';
		this.pageconf.onchange(1,10,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject);
		this.queryCourse();
	},
	methods:{
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
		addNewTest:function(){//打开新增窗口
			this.addnewshow=true;
			this.addtesttype='';
		},
		remove:function(){//关闭新增窗口
			this.addnewshow=false
		},
		sureadd:function(){//确认新增试卷
			console.log('--------------------跳转'+this.addtesttype)
			var self=this;
			if( !self.addtestname ){
				layer.msg('请填写试卷名称!');
				return false;
			}
			if( !self.addtesttype ){
				layer.msg('请试卷类型学!');
				return false;
			}
			if( !self.addmajorid ){
				layer.msg('请请选择所属学科!');
				return false;
			}
			var data={
				command:"exampaper/addpaper",
				sessionid:getCookie('sid'),
				loginid:getCookie('uid'),
				name:self.addtestname,
				type:self.addtesttype,
				majorid:self.addmajorid,
			}
			function callback(res){
				console.log(res)
				if(res.errcode==0){
					if (self.addtesttype==1) {
						window.location.assign("./testpaper_theorypaper.html?id="+res.paperid)
					}if (self.addtesttype==2) {
						window.location.assign("./testpaper_operatepaper.html?id="+res.paperid)
					}if (self.addtesttype==3) {
						window.location.assign("./testpaper_theorypool.html?id="+res.paperid)
					}if (self.addtesttype==4) {
						window.location.assign("./testpaper_operatepool.html?id="+res.paperid)
					}
				}
			}
			post("/exampaper/addpaper",data,callback,errcodefn,errfn)
		},
		search:function(){//查询
			this.starttime = $('#form-starttime').val();
			this.endtime = $('#form-endtime').val();
			this.pageconf.current=1;
			this.pageconf.onchange(this.pageconf.current,this.pageconf.itemsPerPage,this.pageconf.name,this.pageconf.type,this.pageconf.person,this.pageconf.subject,this.starttime,this.endtime)
		},
		checkpaper: function(id,type){//查看试卷
			if (type==1) {
				window.location.assign("./testpaper_checktheorypaper.html?id="+id)
			}if (type==2) {
				window.location.assign("./testpaper_checkoperatepaper.html?id="+id)
			}if (type==3) {
				window.location.assign("./testpaper_checktheorypool.html?id="+id)
			}if (type==4) {
				window.location.assign("./testpaper_checkoperatepool.html?id="+id)
			}
		},
		editpaper: function(id,type){//编辑试卷
			if (type==1) {
				window.location.assign("./testpaper_theorypaper.html?id="+id)
			}if (type==2) {
				window.location.assign("./testpaper_operatepaper.html?id="+id)
			}if (type==3) {
				window.location.assign("./testpaper_theorypool.html?id="+id)
			}if (type==4) {
				window.location.assign("./testpaper_operatepool.html?id="+id)
			}
		},
		deletepaper: function(id){//删除试卷
			var data={
				command:'exampaper/deletepaper',
				sessionid:getCookie('sid'),
				loginid:getCookie('uid'),
				paperid:id
			}
			function callback(res){
				if(res.errcode==0){
					vm.pageconf.onchange(vm.pageconf.current,vm.pageconf.itemsPerPage);
					layer.msg('已删除');
					return false;
				}
			}
			post('/exampaper/deletepaper',data,callback,errcodefn,errfn)
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
})