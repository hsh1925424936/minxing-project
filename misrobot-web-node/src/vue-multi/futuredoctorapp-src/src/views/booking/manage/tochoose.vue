<template>
	<div class="lhl_add">
		<!--*******************************班级***************************************-->
		<div class="contentBox" v-for="(value,index) in showList" style="padding-top:0.2rem;padding-bottom: 0;">
			<dl v-if="value.reservationtype==1">
				<dd style="margin-top: .2rem;">
					<span class="d-left"> 实验室名称&ensp;&nbsp;:</span>
					<span>{{ value.pname }}</span><span style="vertical-align: middle;margin-left: .15rem;">
						<img src="../../../assets/images/ke-.png" style="height: .25rem;">
					</span>
				</dd>
				<dd>
					<span class="d-left">实验室地址&ensp;&nbsp;:</span>
					<span>{{ value.displayname }}</span>
				</dd>
				<dd>
					<span class="d-left">预 约 时 段&emsp;:</span>
					<span>{{ value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5)}}</span>
				</dd>
				<dd>
					<span class="d-left">被&emsp;占&emsp;用&ensp;&nbsp;:</span>
					<span>{{ value.applyconsent }}/{{ value.volume }}</span>
				</dd>
				<dd>
					<span class="d-left">申 请 人 数&emsp;:</span>
					<span>{{ value.applicants }}</span>
				</dd>
				<dd>
					<span class="d-left">预 约 老 师&emsp;:</span>
					<span>{{ value.teachername }}&nbsp;&nbsp;{{value.mobile}}</span>
				</dd>
				<dd style="display: flex;">
					<span class="d-left">预约项名称&ensp;&nbsp;:</span>
					<p class="d-right">
						<span v-for="(value2,index2) in showList[index].learnids">{{ value2.learnname }}&nbsp;&nbsp;</span>
					</p>
				</dd>
				<dd style="display: flex;">
					<span class="d-left">预 约 备 注&emsp;:</span>
					<span class="d-right">{{ value.comment }}</span>
				</dd>
			</dl>
			<dl v-if="value.reservationtype==2">
				<dd>
					<span class="d-left"> 实验室名称&ensp;&nbsp;:</span>
					<span>{{ value.pname }}</span><span style="vertical-align: middle;margin-left: .15rem;">
						<img src="../../../assets/images/kao.png" style="height: .25rem;">
					</span>
				</dd>
				<dd>
					<span class="d-left">实验室地址&ensp;&nbsp;:</span>
					<span>{{ value.displayname }}</span>
				</dd>
				<dd>
					<span class="d-left">预&emsp;约&emsp;人&ensp;&nbsp;:</span>
					<span>{{ value.teachername }}&nbsp;&nbsp;{{value.mobile}}</span>
				</dd>
				<dd>
					<span class="d-left">训练项名称&ensp;&nbsp;:</span>
					<span>{{ value.learnname }}</span>
				</dd>
				<dd>
					<span class="d-left">人 数 上 限&emsp;:</span>
					<span>{{ value.volumemax }}</span>
				</dd>
				<dd>
					<span class="d-left">预 约 时 段&emsp;:</span>
					<span>{{value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5) }}</span>
				</dd>
				<dd style="display: flex;">
					<span class="d-left">预 约 备 注&emsp;:</span>
					<span>{{ value.examcomment }}</span>
				</dd>
			</dl>
			<dl v-if="value.reservationtype==3">
				<dd style="margin-top: .2rem;">
					<span class="d-left"> 实验室名称&ensp;&nbsp;:</span>
					<span>{{ value.pname }}</span><span style="vertical-align: middle;margin-left: .15rem;">
						<img src="../../../assets/images/geren.png" style="height: .25rem;">
					</span>
				</dd>
				<dd>
					<span class="d-left">实验室地址&ensp;&nbsp;:</span>
					<span>{{ value.displayname }}</span>
				</dd>
				<dd>
					<span class="d-left">预&emsp;约&emsp;人&ensp;&nbsp;:</span>
					<span>{{ value.studentname }}&nbsp;&nbsp;{{value.mobile}}</span>
				</dd>
				<dd>
					<span class="d-left">训练项名称&ensp;&nbsp;:</span>
					<span>{{ value.learnname }}</span>
				</dd>
				<dd>
					<span class="d-left">预 约 位 置&emsp;:</span>
					<span>{{ value.code }}</span>
				</dd>
				<dd>
					<span class="d-left">预 约 时 段&emsp;:</span>
					<span>{{ value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5)}}</span>
				</dd>
				<dd>
					<span class="d-left">预 约 类 型&emsp;:</span>
					<span>{{value.type }}</span>
				</dd>
				<dd style="display: flex;">
					<span class="d-left">预 约 备 注&emsp;:</span>
					<span style="width: 62%;">{{ value.comment }}</span>
				</dd>
			</dl>
            <!--**************************班级预约同意不同意按钮********************************-->
			<div v-if="value.reservationtype==1">
				<hr style="height: 1px;background-color: lightgray;margin-top: .2rem;" />
				<div class="bottomHandlers " style="margin-left: 0px !important;margin-top: 0;height:.8rem;line-height: .8rem;">
					<span class="xiebtn xiebtn-default" @click="open_shadow_disagree(value.scheduleid,value.placeid,value.starttime,value.endtime,value.teacherid)">不同意</span>&nbsp;&nbsp;
					<span class="xiebtn xiebtn-blue " @click="open_shadow_agree(value.scheduleid,value.placeid,value.starttime,value.endtime,value.teacherid)">同意</span>
				</div>
			</div>
			<!--***************************考试预约同意不同意按钮***************************-->
			<div v-if="value.reservationtype==2">
				<hr style="height: 1px;background-color: lightgray;margin-top: .2rem;" />
				<div class="bottomHandlers " style="margin-left: 0px !important;margin-top: 0;height:.8rem;line-height: .8rem;">
					<span class="xiebtn xiebtn-default " @click="noAgree" :noAgreeId="value.id">不同意</span>&nbsp;&nbsp;
					<span class="xiebtn xiebtn-blue " @click="tongyi" :agreeId="value.id">同意</span>

				</div>
			</div>
			<!--**********************************个人预约同意不同意按钮***********************************-->
			<div v-if="value.reservationtype==3">
				<hr style="height: 1px;background-color: lightgray;margin-top: .2rem;" />
				<div class="bottomHandlers " style="margin-left: 0px !important;margin-top: 0;height:.8rem;line-height: .8rem;">
					<span class="xiebtn xiebtn-default " @click="personalNoAgree" :noPersonId="value.id">不同意</span>&nbsp;&nbsp;
					<span class="xiebtn xiebtn-blue " @click="personalAgree" :personId="value.id">同意</span>

				</div>
			</div>
		</div>
		<!--**************************班级 预约同意审批弹出框*********************************************-->
		<c-modal :config="s_advice">
			<p style="padding: .2rem;">请填写审批意见</p>
			<p style="margin:0 0 .4rem 0;">
				<textarea class="advice" v-model="shenpioktxt"></textarea>
			</p>
			<template slot="buttons">
				<button type="button" class="btn btn-blue btn-false " @click="closeShadow()">关闭</button>
				<button type="button" class="btn btn-blue btn-sure" @click="shenpi(1,shenpioktxt)">确认</button>

			</template>
		</c-modal>
         <!--**********************班级预约不同意审批弹出框*****************************-->
		<c-modal :config="s_enlist">
			<p style="padding: .2rem;">请填写审批意见</p>
			<p style="margin:0 0 .4rem 0;">
				<textarea class="advice" v-model="shenpifailtxt"></textarea>
			</p>
			<template slot="buttons">
				<button type="button" class="btn btn-blue btn-false " @click="closeShadow()">关闭</button>
				<button type="button" class="btn btn-blue btn-sure" @click="shenpi(2,shenpifailtxt)">确认</button>

			</template>
		</c-modal>
		<!--*******************************考试审批同意弹出框************************************-->
		<c-modal :config="courseModal">
			<p style="padding: .2rem;">请填写审批意见</p>
			<p style="margin:0 0 .4rem 0;">
				<textarea class="advice" v-model="agreeTextY"></textarea>
			</p>
			<template slot="buttons">
				<button type="button" class="btn btn-blue btn-false " @click="guanbi">关闭</button>
				<button type="button" class="btn btn-blue btn-sure" @click="sureQueRen" :surequerenid="haha">确认</button>

			</template>
		</c-modal>
         <!--****************考试审批不同意弹出框********************************-->
		<c-modal :config="trainModal">
			<p style="padding: .2rem;">请填写审批意见</p>
			<p style="margin:0 0 .4rem 0;">
				<textarea class="advice" v-model="agreeTextN"></textarea>
			</p>
			<template slot="buttons">
				<button type="button" class="btn btn-blue btn-false " @click="fangqi">关闭</button>
				<button type="button" class="btn btn-blue btn-sure" @click="queren" :querenid="sureId">确认</button>

			</template>
		</c-modal>
		<!--******************个人审批意见*****************************************************-->
		<!--**********************同意弹出框*******************-->
		<c-modal :config="personYes">
			<p style="padding: .2rem;">请填写审批意见</p>
			<p style="margin:0 0 .4rem 0;">
				<textarea class="advice" v-model="personTextY"></textarea>
			</p>
			<template slot="buttons">
				<button type="button" class="btn btn-blue btn-false " @click="guanbi">关闭</button>
				<button type="button" class="btn btn-blue btn-sure" @click="personalSure" :personalsureid="personsure">确认</button>

			</template>
		</c-modal>
		<!--***************************不同意弹出框********************************-->
		<c-modal :config="personNo">
			<p style="padding: .2rem;">请填写审批意见</p>
			<p style="margin:0 0 .4rem 0;">
				<textarea class="advice" v-model="personTextN"></textarea>
			</p>
			<template slot="buttons">
				<button type="button" class="btn btn-blue btn-false " @click="fangqi">关闭</button>
				<button type="button" class="btn btn-blue btn-sure" @click="noAgreeSure" :personquerenid="confirmid">确认</button>

			</template>
		</c-modal>
		<no-content v-show="showList.length==0"></no-content>
	</div>
</template>
<script>
	import gefn from '../../../vuex/ge';
	import { mapState, mapActions } from 'vuex';
	import noContent from '../../no_content.vue';
	import methods from '../../../methods';
	import cModal from '../../../components/modal';
	export default {

		props: ['active'],
		data() {
			return {
				showList: [],
				isShadow: false,
				agreeBox: false,
				disagreeBox: false,
				agreeIs: false,
				agreeNo: false,
				toCheckList: '',
				teacherid: '',
				scheduleid: '',
				starttime: '',
				endtime: '',
				placeid: '',
				shenpioktxt: '',
				shenpifailtxt: '',
				agreeList: '',
				sureId: '',
				agreeTextY: '',
				agreeTextN: '',
				personTextY: '',
				personTextN: '',
				confirmid: '',
				haha: '',
				personsure: '',
				personalList: '',
				courseModal: {
					show: false,
					title: '同意',
					hideOnClickOut: true,
					theme: 'hello-world',
					position:'center'
				},
				trainModal: {
					show: false,
					title: '不同意',
					hideOnClickOut: true,
					theme: 'hello-world',
					position:'center'
				},
				s_advice: {
					show: false,
					title: '同意',
					hideOnClickOut: true,
					theme: 'hello-world',
					position:'center'
				},
				s_enlist: {
					show: false,
					title: '不同意',
					hideOnClickOut: true,
					theme: 'hello-world',
					position:'center'
				},
				personYes: {
					show: false,
					title: '同意',
					hideOnClickOut: true,
					theme: 'hello-world',
					position:'center'
				},
				personNo: {
					show: false,
					title: '不同意',
					hideOnClickOut: true,
					theme: 'hello-world',
					position:'center'
				}
			}
		},
		mounted() {
			this.getData();
			let _this = this;
			this.registerToNative('goBack', function(data) {
				if(_this.s_advice.show) {
					_this.s_advice.show = false
				} else if(_this.s_enlist.show) {
					//                  window.location.href='/pages/futuredoctorapp/application.html'
					_this.s_enlist.show = false;
				} else if(_this.trainModal.show) {
					_this.trainModal.show = false;
				} else if(_this.courseModal.show) {
					_this.courseModal.show = false;
				} else {
					window.location.href = '/pages/futuredoctorapp/application.html'
				}
			});
		},
		components: {
			noContent,
			cModal
		},
		watch: {
			'active': function(val, oldVal) {

				if(val) {
					// 刷新
					this.getData();
				}
			}
		},
		methods: {
			...mapActions([
				'showAlert',
				'showConfirm',
				'showLoading',
				'hideLoading',
				'toast'
			]),
			...methods,
			errcodefn: function(res) {
				if(res.errcode == 9904) {
					this.toast("登录信息已失效，请重新登录");
					setTimeout(this.futureAppLogout, 2000)
				} else {
					this.toast(res.errdesc)
				}
			},
			errfn: function() {
				this.toast("连接服务失败")
			},
			post: function(url, data, callback, errcodefn, errfn) {
				var self1 = this;
				data = JSON.stringify({ "1": data });
				var req = new XMLHttpRequest();
				req.open('POST', url);
				req.onreadystatechange = function() {
					if(req.readyState == 4) {
						if(req.status == 200) {
							if(typeof(req.responseText) == "string") {
								var response = JSON.parse(req.responseText)["1"];
							} else {
								var response = req.responseText["1"]
							};
							if(response.errcode == 0) {
								callback(response)
							} else {
								self1.errcodefn(response)
							}
						} else {
							self1.errfn()
						}
					}
				};
				req.send(data)
			},
			setCookie: function(name, value) { //设置cookie
				value = encodeURIComponent(value);
				document.cookie = name + "=" + value;
			},
			getCookie: function(name) { //获取cookie
				var arr = document.cookie.split("; ");
				for(var i = 0; i < arr.length; i++) {
					var _arr = arr[i].split("=");
					if(_arr[0] == name) {
						return decodeURIComponent(_arr[1]);
					}
				}
				return "";
			},
			getData:function(){
				let self=this;
				var classAjax = mpost('/learn/queryapplylist', {
	            command: "learn/queryapplylist",
	            sessionid: self.getCookie('sid'),
	            uid: self.getCookie('uid'),
	            loginid: self.getCookie('uid'),
	            status:0
	           });
	           var testAjax = mpost('/examapply/queryexamapplylist', {
	            command: "examapply/queryexamapplylist",
	            sessionid: self.getCookie('sid'),
	            uid: self.getCookie('uid'),
	            loginid: self.getCookie('uid'),
	            status:1
	           });
	           var personAjax = mpost('/learn/querystuapplylist', {
	            command: "learn/querystuapplylist",
	            sessionid: self.getCookie('sid'),
	            uid: self.getCookie('uid'),
	            loginid: self.getCookie('uid'),
	            status:0
	           });
	           $.when(classAjax, testAjax,personAjax).done(function (classtask, testtask,persontask) {
	           	console.log(personAjax);
            	if (classtask &&classtask.applylist) {
            		self.showList=self.showList.concat(classtask.applylist);
            	}
            	if (testtask &&testtask.examapplylist) {
            		for (var i=0;i<testtask.examapplylist.length;i++) {
            			if(testtask.examapplylist[i].placeid == "-1") {
							testtask.examapplylist[i].displayname = testtask.examapplylist[i].placeinfo;
							testtask.examapplylist[i].roomnum = testtask.examapplylist[i].placeinfo;
						}
            			self.showList.push(testtask.examapplylist[i]);
            		}
            	}
            	if (persontask && persontask.stuapplylist) {
            		for (var i=0;i<persontask.stuapplylist.length;i++) {
            			if (persontask.stuapplylist[0].type==0) {
            				persontask.stuapplylist[0].type="在线";

            			}else if(persontask.stuapplylist[0].type==1){
            				persontask.stuapplylist[0].type="模型";

            			}else{
            				persontask.stuapplylist[0].type="智能";

            			}
            			self.showList.push(persontask.stuapplylist[i]);
            		}
            	}
            	for (var i=0;i<self.showList.length;i++) {
						for (var j=0;j<self.showList.length-i-1;j++) {
							if (getTimes(self.showList[j].starttime)>getTimes(self.showList[j+1].starttime)) {
								var temp=self.showList[j];
								self.showList[j]=self.showList[j+1];
								self.showList[j+1]=temp;
							}
						}
				}
            });
			},
			sureQueRen: function() {
				var self = this;
				var data = {
					command: 'examapply/approveexamapply',
					sessionid: self.getCookie('sid'),
					loginid: self.getCookie('uid'),
					status: 0,
					id: $(event.target).attr('surequerenid'),
					auditcomment: self.agreeTextY
				};

				methods.post('/examapply/approveexamapply', data)
					.done(function(res) {
						if(res.errcode == "0") {
							self.showList=[];
							self.toast('审批成功');
							self.getData();

						} else {
							self.toast(res.errdesc || '系统错误，稍后再试');
						}
					})
					.fail(function(data) {
						if(data) {

						}
					})
					.always(function() {
						self.courseModal.show = false;
					});
			},
			shenpi: function(type, txt) {
				var self = this;
				if(txt.length == 0) {
					self.toast('请输入审批意见');
					return;
				};
				var data = {
					command: 'learn/examineapply',
					sessionid: self.getCookie('sid'),
					loginid: self.getCookie('uid'),
					status: type, //0：待审批，1：待训练，2，不通过，3，已取消
					description: txt,
					placeid: self.placeid,
					scheduleid: self.scheduleid,
					starttime: self.starttime,
					endtime: self.endtime,
					teacherid: self.teacherid
				};

				function callback(res) {
					self.showList=[];
					self.toast('审批成功');
					self.s_advice.show = false;
					self.s_enlist.show = false;
					self.shenpioktxt = '';
					self.shenpifailtxt = '';
					self.getData();
				}
				self.post('/learn/examineapply', data, callback, self.errcodefn, self.errfn)
			},
			open_shadow_agree: function(dataScheduleid, dataPlaceid, dataStarttime, dataEndtime, dataTeacherid) {
				this.s_advice.show = true;
				this.scheduleid = dataScheduleid;
				this.placeid = dataPlaceid;
				this.starttime = dataStarttime;
				this.endtime = dataEndtime;
				this.teacherid = dataTeacherid;
				this.shenpioktxt = '同意';
			},
			tongyi: function() {
				// this.agreeShow=true;
				this.courseModal.show = true;
				this.haha = $(event.target).attr('agreeid');
				this.agreeTextY = '同意';
			},
			personalAgree: function() {
				this.personYes.show = true;
				this.personsure = $(event.target).attr('personid');
				this.personTextY = "同意";
			},
			personalNoAgree: function() {
				this.personNo.show = true;
				this.confirmid = $(event.target).attr('nopersonid');
				this.personTextN = "不同意";
			},
			noAgree: function() {
				//this.agreeShow = true;
				this.trainModal.show = true;
				this.sureId = $(event.target).attr('noagreeid');
				this.agreeTextN = '不同意';
			},
			open_shadow_disagree: function(dataScheduleid, dataPlaceid, dataStarttime, dataEndtime, dataTeacherid) {
				this.s_enlist.show = true;
				this.scheduleid = dataScheduleid;
				this.placeid = dataPlaceid;
				this.starttime = dataStarttime;
				this.endtime = dataEndtime;
				this.teacherid = dataTeacherid;
				this.shenpifailtxt = '不同意';
			},
			closeShadow: function() {
				this.courseModal.show = false;
				this.s_advice.show = false;
				this.s_enlist.show = false;
				this.agreeBox = false;
				this.disagreeBox = false;
			},
			fangqi: function() {
				this.trainModal.show = false;
				this.personNo.show = false;
			},
			guanbi: function() {
				this.courseModal.show = false;
				this.personYes.show = false;
			},
			queren: function() {
				var self = this;
				var data = {
					command: 'examapply/approveexamapply',
					sessionid: self.getCookie('sid'),
					loginid: self.getCookie('uid'),
					status: 2,
					id: $(event.target).attr('querenid'),
					auditcomment: self.agreeTextN
				};

				function callback(res) {
					self.showList=[];
					self.toast('审批成功');
					self.getData();
					self.agreeShow = false;
					self.trainModal.show = false;
				};
				this.post('/examapply/approveexamapply', data, callback, this.errcodefn, this.errfn)
			},
			personalSure: function() {
				var self = this;
				var data = {
					command: 'learn/examinestuapply',
					sessionid: self.getCookie('sid'),
					loginid: self.getCookie('uid'),
					status: 0,
					id: $(event.target).attr('personalsureid'),
					description: self.personTextY
				};

				function callback(res) {
					self.showList=[];
					self.toast('审批成功');
					self.getData();
					self.personYes.show = false;
				};
				this.post('/learn/examinestuapply', data, callback, this.errcodefn, this.errfn)
			},
			noAgreeSure: function() {
				var self = this;
				var data = {
					command: 'learn/examinestuapply',
					sessionid: self.getCookie('sid'),
					loginid: self.getCookie('uid'),
					status: 5,
					id: $(event.target).attr('personquerenid'),
					description: self.personTextN
				};

				function callback(res) {
					self.showList=[];
					self.toast('审批成功');
					self.getData();
					self.personNo.show = false;
				};
				this.post('/learn/examinestuapply', data, callback, this.errcodefn, this.errfn)
			}
		}
	}
	//***********************************************************************************************
	function mpost(url, data, param) {
		return $.ajax(url, $.extend({
			type: 'POST',
			contentType: "application/json"
		}, param, {
			data: JSON.stringify({
				"1": data
			})
		})).then(function(data, status, jqXhr) {
			return data && data['1'];
		});
	}
	function  getTimes(date){
        	var timestamp = Date.parse(new Date(date));
        	    timestamp=timestamp/1000;
                return timestamp
        }
	function mpost(url, data, param) {
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
    }
</script>
<style scoped>
	.contentBox dl{
		/*padding:0.2rem 0;*/
	}
	.lhl_add dl {
		/*margin-top: -.2rem;*/
	}

	.lhl_add dl>dd {
		/*margin-bottom: .14rem;*/
		padding:0.07rem 0;
	}

	.lhl_add dd .d-left {
		width: 1.7rem;
		color: #747474;

	}

	.lhl_add dd span:nth-child(2) {
		color: #4c4c4c;
	}

	.lhl_add dd .d-special {
		color: black;
		font-weight: 400;
	}

	.lhl_add .btn-no {
		background-color: white !important;
		width: 1.5rem;
	}

	.lhl_add .btn-yes {
		width: 1.5rem;
		margin-left: .1rem !important;
	}

	.lhl_add .advice {
		outline: 1px solid lightgray;
		margin-bottom: .2rem;
		width: 80%;
		height: 2rem;
		margin-left: 10%;
	}

	.lhl_add .btytext {
		padding: .1rem .2rem;
		background-color: #666666;
		text-align: center;
		color: white;
		border-radius: .1rem .1rem 0 0;
	}

	.lhl_add .btn-sure {
		color: #3499db !important;
		font-size: .26rem !important;
	}

	.lhl_add .btn-false {
		color: black !important;
		font-size: .26rem !important;
	}

	.lhl_add .spyjwz {
		margin-left: .08rem;
	}

	.lhl_add .spyjsr1 {
		float: left;
		width: 90%;
		height: .89rem;
		max-height: .89rem;
		max-width: 90%;
		padding-left: .2rem;
	}

	.lhl_add .srk {
		margin-left: .1rem;
		margin-right: .1rem;
		margin-top: .1rem;
	}

	.lhl_add .srkqr {
		float: left;
		margin-left: .1rem;
	}

	.lhl_add .bottomHandlers {
		margin-top: .1rem;
		overflow: hidden;
	}

	.lhl_add .d-right {
		width: 62%;
		display: inline-block;
	}
</style>
