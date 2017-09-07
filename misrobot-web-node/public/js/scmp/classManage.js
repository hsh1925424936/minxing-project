Vue.filter('classstatus', function(value) {
	if(value == 1) {
		return "正常";
	} else {
		return '已结课'
	}
})
Vue.filter('classcourseinfo', function(value) {
	var coursename = [];
	for(var i = 0; i < value.length; i++) {
		coursename.push(value[i].coursename);
	}
	return coursename.toString();
})

var vm = new Vue({
	el: "#message-student",
	data: {
		addclassShow: false, //新增班级
		studentShow: false, //学生
		editShow: false, //编辑
		finishShow: false, //结课
		deleteShow: false, //删除
		// totallist:[],//总条数
		classlist: [], //上课班级列表
		studentlist: [], //学生列表
		selectcourses: [], //选择课程
		selectteacher: [], //选择老师
		courselist: [1], //课程列表
		coursenum: 0, //增加课程列表编号
		addnewcourse: [], //新增课程
		addnewcourselist: [],
		editnewcourse: [],
		// pagenum:'1',//页数
		// perpagenum:'10',//每页条数
		// totalpage:'',//总条数
		// totalpagenum:'',//页数
		gradelist: [], //年级列表
		gradenum: '', //年级
		editnew_name: '',
		perclassid: '',
		new_name: '',
		selgrade: '',
		hehe: '',
		courseindex: 0,
		pageconf: {
			itemsPerPage: 10,
			current: 1, //默认显示第一页
			showItem: 10, //最多显示多少页，自己定义
			allpage: '', //总共多少页，根据请求返回结果计算
			totalnum: '', //总共条数，请求返回
			onchange: function(index, itemsperpage) { //ajax,index表示查看第几页,itemsperpage表示每页多少条

				// console.log(index+'------'+itemsperpage)
				// changepage('page=' + index + '&number=' + itemsperpage);
				var data = {
					command: "cls/listsclass",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					pagenum: index, //查询第几页
					perpagenum: itemsperpage //每页展示多少条,

				};

				function callback(res) {

					vm.pageconf.totalnum = res.resultsum;
					vm.pageconf.allpage = Math.ceil(res.resultsum / itemsperpage);
					vm.classlist = [];
					vm.classlist = res.sclassList;
				};
				post("/cls/listsclass", data, callback, errcodefn, errfn)
			}
		},
	},
	mounted: function() {
//		$(this.$el).on('change', '[data-role=uploadStuBtn]', function(){
//			importExcel($(this), {
//				command: 'cls/importStd',
//				sessionid: getCookie('sid'),
//				loginid: getCookie('uid')
//			}, function(data){
//				if(data && data.errcode == '0') {
//					layer.msg('操作成功！');
//				} else {
//					layer.alert((data && data.errdesc) || '操作失败，请稍后再试！', {
//					  // icon: 1,
//					  skin: 'layer-ext-moon'
//					})
//				}
//			}, function(data){
//				layer.msg((data && data.errdesc) || '操作失败，请稍后再试！');
//				// console.log(data);
//			});
//		});
        
        
        $('.fileUpload').on('change', '.uploadfile', function(){
					
					var val = $('.uploadfile').val();
					
					

					if(!val) return;
					var data={
		            	command:'cls/importStd',
		            	sessionid:getCookie('sid'),
		            	loginid:getCookie('uid'),
		            }
		            function callback(res){
		            	
		            	$('.uploadfile').val('');
		            	console.log(res)
		            	if (res && res.errcode==000000) {
		            		layer.msg('导入成功')
		            	self.pageconf.onchange(1, 10);
		            	}else{
		            		layer.msg(res.errdesc)
		            	}
		            	
	           		}
					importExcel($('.uploadfile'),data,callback, function(){
						$('.uploadfile').val('');
					})
				});
        
		this.pageconf.onchange(1, 10);
		this.selectcourses = [];
		this.selectteacher = [];
		this.gradelist = [];
		my_require.R({
			url: '/cls/selectCourses',
			data: {
				command: "cls/selectCourses",
				sessionid: getCookie('sid'),
				loginid: getCookie('uid'),
			},
			callback: function(base) {
				vm.selectcourses = base.courseslist;
			}
		});
		my_require.R({
			url: '/cls/selectteacher',
			data: {
				command: "cls/selectteacher",
				sessionid: getCookie('sid'),
				loginid: getCookie('uid'),
				requestpage: '1',
				sizeperpage: '1000'
			},
			callback: function(base) {
				vm.selectteacher = base.teacherlist;
			}
		});
		my_require.R({
			url: '/commparaconf/querycommparaconflist',
			data: {
				command: "commparaconf/querycommparaconflist",
				paramcode: 'gradelist',
			},
			callback: function(base) {
				// vm.selgrade=item.grade;
				vm.gradelist = base.commparaconflist;
			}
		});
	},
	methods: {
		remove: function() {
			this.addclassShow = false;
			this.studentShow = false;
			this.editShow = false;
			this.finishShow = false;
			this.deleteShow = false;
		},
		cancel: function() {
			this.addclassShow = false;
			this.studentShow = false;
			this.editShow = false;
			this.finishShow = false;
			this.deleteShow = false;
		},
		add: function() {
			this.editShow = false;
			this.addnewcourselist = [];
			this.addnewcourse = [];
			this.new_name = '';
			this.addclassShow = true;
		},
		addclass: function() { //添加班级到新增列表
			this.addnewcourselist.push({
				course: this.selectcourses[0].name,
				teacher: this.selectteacher[0].name
			})
		},
		sureaddclass: function() { //确认新增班级
			coursedata();
			var addidarr = [];
			for(var i = 0; i < this.addnewcourse.length; i++) {
				var idobj = {
					id: '',
					teacherid: ''
				}
				var coursestr = this.addnewcourse[i].course;
				var teacherstr = this.addnewcourse[i].teacher;
				for(var j = 0; j < this.selectcourses.length; j++) {
					if(coursestr == this.selectcourses[j].name) {
						idobj.id = this.selectcourses[j].id
					}
				}
				for(var h = 0; h < this.selectteacher.length; h++) {
					if(teacherstr == this.selectteacher[h].name) {
						idobj.teacherid = this.selectteacher[h].id
					}
				}
				addidarr.push(idobj);
			}
			this.gradenum = $("#grade").find("option:selected").text();
			if(!this.new_name) {
				layer.msg('请填写班级名称!');
				return false;
			}
			if(this.addnewcourse.length == 0) {
				layer.msg('请添加课程和老师!');
				return false;
			}
			my_require.R({
				url: '/cls/addsclass',
				data: {
					command: "cls/addsclass",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					name: this.new_name,
					courselist: addidarr,
					type: '0',
					grade: this.gradenum,
				},
				callback: function(base) {
					vm.pageconf.onchange(vm.pageconf.current, vm.pageconf.itemsPerPage)
				}
			});
			this.addclassShow = false;
		},
		deletenewclass: function(index) { //删除新增班级课程记录
			var tempArr = [];
			for(var i = 0; i < this.addnewcourselist.length; i++) {
				if(i != index) {
					tempArr.push(vm.addnewcourselist[i])
				}
			};
			this.addnewcourselist = tempArr;
		},
		student: function(classid) { //学生
			this.studentShow = true;
			my_require.R({
				url: '/cls/listsclassStd',
				data: {
					command: "cls/listsclassStd",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					pagenum: '1',
					perpagenum: '1000',
					id: classid
				},
				callback: function(base) {
					vm.studentlist = base.stdlist;
				}
			});
		},
		edit: function(item) { //编辑
			this.addclassShow = false;
			this.perclassid = item.classid;
			this.editnew_name = item.classname;
			this.editnewcourse = [];
			this.selgrade = item.grade;
			var course = item.coursinfo;
			for(var i = 0; i < course.length; i++) {
				this.editnewcourse.push({
					course: course[i].coursename,
					teacher: course[i].teachername
				})
			}
			console.log('1-----------' + JSON.stringify(this.editnewcourse))
			this.editShow = true;
		},
		editclass: function() { //添加班级到新增列表
			this.editnewcourse.push({
				course: this.selectcourses[0].name,
				teacher: this.selectteacher[0].name
			});
		},
		sureedit: function() {
			var addidarr = [];
			for(var i = 0; i < this.editnewcourse.length; i++) {
				var idobj = {
					id: '',
					teacherid: ''
				}
				var coursestr = this.editnewcourse[i].course;
				var teacherstr = this.editnewcourse[i].teacher;
				for(var j = 0; j < this.selectcourses.length; j++) {
					if(coursestr == this.selectcourses[j].name) {
						idobj.id = this.selectcourses[j].id
					}
				}
				for(var h = 0; h < this.selectteacher.length; h++) {
					if(teacherstr == this.selectteacher[h].name) {
						idobj.teacherid = this.selectteacher[h].id
					}
				}
				addidarr.push(idobj)
			}
			this.gradenum = $("#editgrade").find("option:selected").text();
			if(!this.editnew_name) {
				layer.msg('请填写班级名称!');
				return false;
			}
			if(this.editnewcourse.length == 0) {
				layer.msg('请添加课程和老师!');
				return false;
			}
			my_require.R({
				url: '/cls/updatesclass',
				data: {
					command: "cls/updatesclass",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					id: this.perclassid,
					name: this.editnew_name,
					courselist: addidarr,
					grade: this.gradenum
				},
				callback: function(base) {
					vm.pageconf.onchange(vm.pageconf.current, vm.pageconf.itemsPerPage)
				}
			});
			this.editShow = false;
		},
		deleteeditclass: function(index) {
			var tempArr = []; // console.log(index)
			for(var i = 0; i < vm.editnewcourse.length; i++) {
				if(i != index) {
					tempArr.push(vm.editnewcourse[i])
				}
			};
			vm.editnewcourse = tempArr;
		},
		finish: function(classid,status) { //结课
			if (status==2) {
				layer.msg('该班级已结课！')
			} else {
				this.finishShow = true;
				this.perclassid = classid;
			}
		},
		surefinish: function() {
			my_require.R({
				url: '/trainingplan/updatetrainingstatus',
				data: {
					command: "trainingplan/updatetrainingstatus",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					sclassid: this.perclassid,
					trainingstatus: 4,
					sclassstatus: 2
				},
				callback: function(base) {
					if(base.errcode == 0) {
						vm.pageconf.onchange(vm.pageconf.current, vm.pageconf.itemsPerPage)
						layer.msg('结课成功！')
					} else {
						layer.msg('该班级有未结束的课程或已结课！')
					}
				}
			});
			this.finishShow = false;
		},
		delete_message: function(classid) { //删除
			this.deleteShow = true;
			this.perclassid = classid;
		},
		suredelete_message: function() { //确认删除
			my_require.R({
				url: '/cls/deletesclass',
				data: {
					command: "cls/deletesclass",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					id: this.perclassid
				},
				callback: function(base) {
					if(base.errdesc == 'OK') {
						layer.msg('删除成功')
						vm.pageconf.onchange(vm.pageconf.current, vm.pageconf.itemsPerPage)
					} else {
						layer.msg('该班级已有课程，不可删除');
					}
				}
			});
			this.deleteShow = false;
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

function coursedata() {
	$(".coursedata").find('tr').each(function() {
		vm.addnewcourse.push({
			course: $(this).find('#addcourse').find('select').find("option:selected").text(),
			teacher: $(this).find('#addteacher').find('select').find("option:selected").text()
		});
	});
}