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

var vm = new Vue({
	el:"#ck-stu-result",
	data: {
		sname: '',
		sno: '',
		starttime: '',
		endtime: '',
		learns: [],
		learnid: -1,
		examstatus: -1,
		list: [],
        page: 1,
        pageSize: 10,
        // pageSizeList: [10, 20, 30],
        total: 0,
        totalPage: 0,
        pageList: [],
        showUserInfo: false,
        detailInfo: {}
	},
	mounted: function() {
		
		var self = this;

		// 获取可选的技能项
		this.post('/learn/querylearninfo', {
			command: "learn/querylearninfo",
			sessionid: $.cookie('sid'),
			loginid: $.cookie('uid'),
			type:3
		}).done(function (data) {
			self.learns = data && data.learnids;
		});
		
		this.loadData();
	},
    watch: {
        "total": function (newTotal) {
            this.refreshPageList();
        },
        "page" : function(){
			this.refreshPageList();
            this.loadData();
        },
        "pageSize": function () {
			this.refreshPageList();
            this.loadData();
        }
    },
    filters: {
        ustatus: function (s) {
            
            var str = '';
            
            switch (s) {
                case 0:
                    str  = '待考';
                    break;
                case 1:
                    str = '待审核';
                    break;
                case 2:
                    str = '审核不通过';
                    break;
                case 3:
                    str = '取消';
                    break;
                case 4:
                    str = '已考试';
                    break;
                case 5:
                    str = '缺考';
                    break;
            }
            
            return str;
        }
    },
	methods: {
		refreshPageList: function(){
			var plist = [];
			var tempA = 0;
			var tempB = 0;
			
			this.totalPage = Math.ceil(this.total / this.pageSize) || 0;
			
			if(this.page > this.totalPage) {
				this.page = this.totalPage;
			}
			
			plist.push(this.page);
			for(var i = 1; i < 10; i++) {
				
				tempA = this.page - i;
				tempB = this.page + i;
				
				if(tempA > 0 ) {
					plist.unshift(tempA);
				}
				
				if(tempB <= this.totalPage) {
					plist.push(tempB);
				}
				
				if(plist.length >= 10) {
					break;
				}
			}
			this.pageList = plist;
		},
		post: function(url, data, param) {
			return $.ajax(url, $.extend({
				type: 'POST',
				contentType: "application/json"
			}, param, {
				data : JSON.stringify({
					"1": data
				})
			})).then(function (data, status, jqXhr) {
				return data && data['1'];
			});
		},
		search: function() {
			this.starttime = $('#form-starttime').val();
			this.endtime = $('#form-endtime').val();

			this.loadData();
		},
        changePage: function (page) {
			
            if(page > 0 && page != this.page) {
                this.page = page;
            }
        },
		loadData: function() {
			var self = this;
			var d = {
				command: "ckexamapply/liststudentscore",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
                requestPage: self.page > 0 ? self.page : 1,
                sizePerPage: self.pageSize
			};
			
			if(this.sname) {
				d.name = this.sname;
			}
			
			if(this.sno) {
				d.code = this.sno;
			}
			
			if(this.learnid > 0 && this.learnid != '-1') {
				d.learnid = this.learnid;
			}
			
			if(this.examstatus > 0 && this.examstatus != '-1') {
				d.status = this.examstatus;
			}
			
			if(this.starttime) {
				d.starttime = this.starttime;
			}
			
			if(this.endtime) {
				d.endtime = this.endtime;
			}

			this.post('/ckexamapply/liststudentscore', d)
				.then(function (data, status, jqXhr) {
					self.list = data && data.students;
                    self.total = data && data.total;
				});
		},
		showDetail: function (info) {
            
			var self = this;
			
			this.post('/report/querystudentckreport', {
				command: "report/querystudentckreport",
				examid: info.examid,
				studentid: info.uid,
				scoretype:"1"
			}).done(function (data) {
                
                self.detailInfo = data;
                self.showUserInfo = true;
			}).fail(function () {
				
			});
		},
		exportExcel: function() {
			var data = {
				command: "ckexamapply/liststudentscore",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
				requestPage: 1,
				sizePerPage: 500
			};
			
			if(this.sname) {
				data.name = this.sname;
			}
			
			if(this.sno) {
				data.code = this.sno;
			}
			
			if(this.learnid > 0 && this.learnid != '-1') {
				data.learnid = this.learnid;
			}
			
			if(this.examstatus > 0 && this.examstatus != '-1') {
				data.status = this.examstatus;
			}
			
			if(this.starttime) {
				data.starttime = this.starttime;
			}
			
			if(this.endtime) {
				data.endtime = this.endtime;
			}
			
			var name = "download_name" + new Date().getTime();
			var $iframe = $('<iframe name="' + name + '"></iframe>').appendTo('body');
			var $form = $('<form target="' + name + '" action="/export/exportExcel" method="POST" enctype="application/x-www-form-urlencoded"></form>').appendTo('body');
			var $content = $('<input type="hidden" name="_form_body" />').appendTo($form);
			var $inp;
			
			$iframe.css("display", "none");
			$form.css("display", "none");

			$content.val(JSON.stringify({
				"1": data
			}));
			$form.submit();
		}
	}
})