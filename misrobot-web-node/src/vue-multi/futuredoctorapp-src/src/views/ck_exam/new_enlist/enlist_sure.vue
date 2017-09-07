<template>
	<div class="g-wrapper">
		<c-header>
			<div slot="headerLeft">
				<a @click="back()" class="header-back-btn">
					<img src="../../../assets/images/icon_fanhui.png" />
				</a>
			</div>
			考试报名确认
		</c-header>
		<div class="booking-lab-sel g-main">
			<div class="list lab-list " v-infinite-scroll="loadData">
				<template>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="auto-width">
							<p class="addr">技能项</p>
						</div>
						<a><span>{{placelist.name}}</span></a>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="auto-width">
							<p class="addr">地点</p>
						</div>
						<a><span>{{placelist.placeinfo}}</span></a>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="auto-width">
							<p class="addr">考试时间</p>
						</div>
						<a><span>{{placelist.starttime|substr(0,16)}}-{{placelist.endtime|substr(11,5)}}</span></a>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="auto-width">
							<p class="addr">报名截止时间</p>
						</div>
						<a><span>{{placelist.joinlasttime}}</span></a>
					</a>
					<a class="item valign-center">
						<i class="iconfont icon-clock"></i>
						<div class="auto-width">
							<p class="addr"> 报名人数</p>
						</div>
						<a><span>{{placelist.enrollment}}/{{placelist.volumemax}}</span></a>
					</a>
				</template>
			</div>
		</div>
		<div class="padding">
			<a class="btn btn-blue btn-lg btn-block" @click="submitEnlist1()"> 立即报名 </a>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery';
	import methods from '../../../methods';
	import { mapState, mapActions } from 'vuex';
	import Vue from 'vue';
	import cTabs from "../../../components/tabs";
	import cTab from "../../../components/tab";
	import cHeader from '../../header';
	import cModal from '../../../components/modal';
	import xieFn from '../../../vuex/xie.js'

	let bus = new Vue();

	export default {
		data() {
			return {
				placelist: '',
				type: 1,
				bus: bus,
				list: [],
				list2: [],
				allTime: '',
				lastTime: ""
			}
		},
		components: {
			cTabs,
			cTab,
			cHeader,
			cModal
		},
		created() {},
		mounted() {
			//获取数据
			let self = this;
			var data = {
				command: "ckexamapply/querycklearn",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
				uid: $.cookie('uid')
			}
			this.placelist = this.$route.query.booking;
			//弹出框
			this.showAlert({
				msg: '若考试报名人数过少，该考试可能会被取消，请留意通知！',
				title: null,
				ok: function() {
					this.show = false;
				}
			});
            this.registerToNative('goBack', function (data) {
                self.back();
            });

		},
		methods: {
            ...methods,
			...mapActions([
				'showAlert',
				'showConfirm',
				'showLoading',
				'hideLoading',
				'toast'
			]),
			back() {
				this.$router.push({
					name: 'fdEnlist',
					query: ''
				})
			},
			changeTab(tab) {
				this.type = tab.data;
			},
			submitEnlist1: function() {
				let self = this;
				var data = {
					command: "ckexamapply/confirmCk",
					sessionid: $.cookie('sid'),
					loginid: $.cookie('uid'),
					uid: $.cookie('uid'),
					examid: self.placelist.examid,
					planid: self.placelist.planid
				}

				function callback(res) {
					self.$router.push({
						name: 'fdstudentTest',
						query: ''
					})

				}
				xieFn.post('/ckexamapply/confirmCk', data, callback, xieFn.errcodefn, xieFn.errfn);
			}
		}
	}
</script>
<style>
    
</style>
