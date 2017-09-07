//homepage任务和消息组件
Vue.component('c-task-and-msg', {
	template:
		'<div class="c_task_and_msg">' +
			'<div class="task">' +
				'<div class="c_task_and_msg_top">' +
					'<div class="c_task_and_msg_top_left">' +
						'<h5>任务</h5><div>{{taskcount}}</div>' +
					'</div>' +
					'<div class="c_task_and_msg_top_right" v-show="false">' +
						'<span>更多</span>' +
						'<img src="../../images/homepage/btn_xiangyou1.png"/>' +
					'</div>' +
				'</div>' +

				'<ul @scroll="scroll_get_task()">' +
					'<p class="no-data" v-if="tasklist.length==0 && has_all_task">' +
						'暂无任务' +
					'</p>' +
					'<div>'+
						'<li v-for="(value,i) in tasklist" @click="task_click()">' +
							'<p>' +
								'{{value.createdtimestr | str(11,19)}}&nbsp;{{value.taskname}}&nbsp;{{value.tasktype | tasktype}}' +
							'</p>' +
							'<span>{{value.createdtimestr | str(0,10)}}</span>' +
						'</li>' +
						'<template v-if="!has_all_task">'+
							/*加载更多按钮*/
							'<button @click="get_task()" v-show="!taskisloading" class="more_task">加载更多</button>' +
							/*加载等待图片*/
							'<img src="../../js/homepage/layer/skin/default/loading-0.gif" v-show="taskisloading" />'+
						'</template>'+
					'</div>'+
				'</ul>' +
			'</div>' +
			'<div class="msg">' +

				'<div class="c_task_and_msg_top">' +
					'<div class="c_task_and_msg_top_left">' +
						'<h5>消息</h5><div>{{messagecount}}</div>' +
					'</div>' +
					'<div class="c_task_and_msg_top_right" v-show="false">' +
						'<span>更多</span>' +
						'<img src="../../images/homepage/btn_xiangyou1.png"/>' +
					'</div>' +
				'</div>' +

				'<ul @scroll="scroll_get_msg()">' +
					'<p class="no-data" v-if="messagelist.length==0 && has_all_msg">' +
						'暂无消息' +
					'</p>' +
					'<div>'+
						'<li v-for="(value,i) in messagelist" @click="msg_detail(value.id)">' +
							'<p>' +
								'{{value.title}}' +
							'</p>' +
							'<span>{{value.departtime | str(0,10)}}</span>' +
						'</li>' +
						'<template v-if="!has_all_msg">'+
							/*加载更多按钮*/
							'<button @click="get_msg()" v-show="!msgisloading">加载更多</button>' +
							/*加载等待图片*/
							'<img src="../../js/homepage/layer/skin/default/loading-0.gif" v-show="msgisloading" />'+
						'</template>'+
					'</div>'+
				'</ul>' +
			'</div>' +
            '<div class="c_task_dialog">' +
                '<img class="c_task_dialog_close" src="../../images/homepage/btn_guanbi.png"' +
                    '@click="c_task_dialog_close()"/>' +
                '<h3>提示</h3>' +
                '<p>请登录明日良医手机端进行操作</p>' +
                '<button @click="c_task_dialog_close()">确认</button>' +
            '</div>' +
		'</div>',
	props:[],
	data: function () {
		return {
			// 任务
			taskcount:0, tasklist:[], taskpage:1,
			taskisloading:false,//是否正在加载任务
			has_all_task:false,//是否获取到所有的任务

			// 消息
            messagecount:0, messagelist:[], messagepage:1,
            msgisloading:false,//是否正在加载消息
            has_all_msg:false,//是否获取到所有的消息
            c_task_dialog_index:-1,
		}
	},
	methods: {
		// 加载消息
		get_msg:function(){
			var self = this;
			if(self.msgisloading || self.has_all_msg){//已经在加载或者加载完了所有消息
				return false;
			}
			self.msgisloading = true;
			Api.R({
				url:'/announce/queryannouncelist',
				data:{
					command:"announce/queryannouncelist",
					sessionid:getCookie('sid'),
	                loginid:getCookie('uid'),
	                uid:getCookie('uid'),
	                page:self.messagepage,
	                reqnum:5,
				},
				callback:function(data){
					self.messagecount = data.allcount || 0;
					if (data.announcelist.length < 5){
						self.has_all_msg = true;
					}
					self.messagelist = self.messagelist.concat(data.announcelist);
					self.messagepage++;
					self.msgisloading = false;
				}
			});
		},
		//通过滚动加载消息
		scroll_get_msg:function(){
			if( ( 5 + $('.msg>ul').scrollTop()) >= ($('.msg>ul>div').height() - $('.msg>ul').height()) ){
				this.get_msg();
			}
		},
		// 加载任务
		get_task:function(){
			var self = this;
			if(self.taskisloading || self.has_all_task){//已经在加载或者加载完了所有任务
				return false;
			}
			self.taskisloading = true;
			Api.R({
				url:'/task/queryusertaskinfo',
				data:{
					command:"task/queryusertaskinfo",
					sessionid:getCookie('sid'),
	                loginid:getCookie('uid'),
	                uid:getCookie('uid'),
	                page:self.taskpage,
	                reqnum:5,
	                tasktype:''
				},
				callback:function(data){
					self.taskcount = data.taskcount || 0;
					if (data.tasklist.length < 5){
						self.has_all_task = true;
					}
					self.tasklist = self.tasklist.concat(data.tasklist);
					self.taskpage++;
					self.taskisloading = false;
				}
			});
		},
		//通过滚动加载任务
		scroll_get_task:function(){
			if( ( 5 + $('.task>ul').scrollTop()) >= ($('.task>ul>div').height() - $('.task>ul').height()) ){
				this.get_task();
			}
		},
		msg_detail:function(id){/*显示消息详情*/
            Api.R({
                url:'/announce/queryannouncedetail',
                data:{
                    command:"announce/queryannouncedetail",
                    sessionid:getCookie('sid'),
                    loginid:getCookie('uid'),
                    uid:getCookie('uid'),
                    announcementid:id,
                },
                callback:function(data){
                    var msg_detail = data.announcelist[0];
                    layer.alert(msg_detail.content+'<br/>'+msg_detail.author+'<br/>'+msg_detail.departtime.split(' ')[0],{title:msg_detail.title});
                }
            });
        },
        task_click:function(){
            var self = this;
            layer.open({
                type: 1,
                closeBtn: 0,
                // shade:'transparent',
                title:false,
                area: 'auto',
                maxWidth:'700px',
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: false,
                content: $('.c_task_dialog'),
                success: function(layero, index){
                    self.c_task_dialog_index = index;
                }
            });
        },
        c_task_dialog_close:function(){
            layer.close(this.c_task_dialog_index);
        }
    },
	computed:{

	},
	created:function(){
		var self = this;
		//消息
		self.get_msg();
		// 任务
		self.get_task();
	},
	mounted:function(){

	},
	watch:{

	},
	filters: {
	    str: function (value, start, end) {
	        if (value && typeof(value) === 'string') {
	            return value.slice(start, end)
	        }
	        return value
	    },
	    tasktype: function (value) {
	        switch(value.tasktype){
	            case 1: return "个人预约"; break;
	            case 2: return "班级预约"; break;
	            case 3: return "出科考试预约"; break;
	            case 5: return "评价"; break;
	            case 6: return "上课"; break;
	            case 7: return "问卷"; break;
	            case 8: return "课前训练"; break;
                case 9: return "随堂小测"; break;
	        }
	    }
	},
})
