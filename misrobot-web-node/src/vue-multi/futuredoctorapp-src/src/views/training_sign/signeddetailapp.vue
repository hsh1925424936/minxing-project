<template>
	<div class="g-wrapper signdetail">
		<c-header>
			<div slot="headerLeft">
				<a @click="back()" class="header-back-btn">
					<img src="../../assets/images/icon_fanhui.png" />
				</a>

			</div>
			报名详情
		</c-header>
		<div class="booking-lab-sel g-main">
			<div class="list lab-list ">
				<p id="lhl_details">{{signedDetailList.trainname}}</p>
				<template>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>培训内容：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.traincomment}}</p>
						</div>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>举办期数：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.trainterm | newWeek}}</p>
						</div>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>培训学时：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.holdingcycle | newDay}}</p>
						</div>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>培训费用：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.trainprice | newMoney}}</p>
						</div>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>举办时间：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.holdtime | newTime}}</p>
						</div>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>备注说明：</p>
						</div>

						<div class=" auto-width">
							<p>{{signedDetailList.remark}}</p>
						</div>
					</a>
                    <a class="item valign-center">
                        <i class="iconfont icon-clock"></i>
                        <div class="lhl_left auto-width">
                            <p>发票抬头：</p>
                        </div>
                        <div class=" auto-width">
                            <p>{{signedDetailList.invoiceheader}}</p>
                        </div>
                    </a>
                    <a class="item valign-center">
                        <i class="iconfont icon-clock"></i>
                        <div class="lhl_left auto-width">
                            <p>纳税人识别号：</p>
                        </div>
                        <div class=" auto-width">
                            <p>{{signedDetailList.taxpayernumber}}</p>
                        </div>
                    </a>
                    <a class="item valign-center">
                        <i class="iconfont icon-clock"></i>
                        <div class="lhl_left auto-width">
                            <p>联系地址：</p>
                        </div>
                        <div class=" auto-width">
                            <p>{{signedDetailList.address}}</p>
                        </div>
                    </a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>报名时间：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.jointime | newTime}}</p>
						</div>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>报名状态：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.status}}</p>
						</div>
					</a>
					<a class="item valign-center" v-if="signedDetailList.status=='已缴费'">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>缴费时间：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.lasttime | newTime}}</p>
						</div>
					</a>
					<a class="item valign-center" v-if="signedDetailList.status=='已取消'">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>审核时间：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.lasttime | newTime}}</p>
						</div>
					</a>
					<a class="item valign-center" v-if="signedDetailList.status=='已取消'">
						<i class="iconfont icon-clock"></i>
						<div class="lhl_left auto-width">
							<p>备注说明：</p>
						</div>
						<div class=" auto-width">
							<p>{{signedDetailList.note}}</p>
						</div>
					</a>
					<a class="item valign-center" v-if="signedDetailList.status=='待审核'||signedDetailList.status=='待缴费'">
						<i class="iconfont icon-clock"></i>
						<button type="button" class="btn btn-yellow" @click="remove($event)" :removeid="detailList.id">取消报名</button>
					</a>
				</template>

			</div>
		</div>

		<c-modal :config="trainModal">
			<p style="padding: .2rem 10%;">请填写取消原因</p>
			<p>
				<textarea class="advice" v-model="removeText"></textarea>
			</p>
			<template slot="buttons">
				<button type="button" class="btn btn-blue btn-false " @click="close">关闭</button>
				<button type="button" class="btn btn-blue btn-sure" @click="sure" :sureid="sureId">确认</button>

			</template>
		</c-modal>
	</div>
</template>

<script>
	import $ from 'jquery';
	import Vue from "vue";
	import { mapState, mapActions } from "vuex";
	import methods from "../../methods";
	import cHeader from "../header";
	import cModal from "../../components/modal";

	export default {
		data() {
			return {
				signedDetailList: '',
				trainModal: {
					show: false,
					title: '取消报名',
					hideOnClickOut: true,
					theme: 'hello-world'
				},
				sureId:'',
				detailList:'',
				removeText:''
			}
		},
		components: {
			cHeader,
			cModal
		},
		created() {},
		mounted() {
			this.detailList = this.$route.query.booking;
			let self = this;
			this.post('/externaltrain/queryregistrationinfo', {
				command: "externaltrain/queryregistrationinfo",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
				id: this.detailList.id
			}).done(function(data) {

				self.signedDetailList = data;
				if(self.signedDetailList.status == 1) {
					self.signedDetailList.status = "待审核";
				} else if(self.signedDetailList.status == 2) {
					self.signedDetailList.status = "待缴费";
				} else if(self.signedDetailList.status == 3) {
					self.signedDetailList.status = "已缴费";
				} else {
					self.signedDetailList.status = "已取消";
				}
			});
			this.registerToNative('goBack', function (data) {
                self.back();
            });
		},
        filters:{
        	newTime:function(val){
        		return val.substring(0,19)
        	},
        	newMoney:function(val){
        		return "￥"+val+".00"
        	},
        	newDay:function(val){
        		return val+"学时/期"
        	},
        	newWeek:function(val){
        		return val+"期"
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
			back() {
				this.$router.push({
					name: "fdtraining_signedlistapp",
					query: ''
				})
			},
			remove: function(event) {
				this.trainModal.show = true;
				this.sureId=$(event.target).attr('removeid');
				this.removeText='';
			},
			close:function(){
				this.trainModal.show = false;
				this.removeText='';
			},
			sure:function(){
				var self=this;
				if (self.removeText=='') {
					self.toast('请输入取消原因');
				}else{
					this.post('/externaltrain/cancelregistration',{
						command: "externaltrain/cancelregistration",
						sessionid: $.cookie('sid'),
						loginid: $.cookie('uid'),
						id: self.detailList.id,
						note:self.removeText
					}).done(function(res){
						self.trainModal.show = false;
						self.back();
					})
				}

			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	#lhl_details {
		height: .8rem;
		line-height: .8rem;
		padding-left: .2rem;
		background-color: #F2F2F2;
	}

	.signdetail .lhl_left {
		margin-right: .2rem;
		width: 60% !important;
	}
	 .signdetail .btn-sure {
		color: #3499db !important;
		font-size: .26rem !important;
	}

	 .signdetail .btn-false {
		color: black !important;
		font-size: .26rem !important;
	}
	 .signdetail .advice {
		outline: 1px solid lightgray;
		margin-bottom: .2rem;
		width: 80%;
		height: 2rem;
		margin: 0 auto;
		padding: .2rem;
	}
	.list .item:last-child{
		border-bottom: 1px solid #C3C3C3;
	}
</style>
