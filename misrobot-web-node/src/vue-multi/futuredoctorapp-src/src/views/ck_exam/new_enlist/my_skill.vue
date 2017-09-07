<template>
	<div class="booking-lab-sel g-wrapper">
		<div class="list lab-list g-main" v-infinite-scroll="loadData">
			<template v-for="it in placelistTwo">
				<a class="item valign-center">
					<i class="iconfont icon-clock"></i>
					<div class="auto-width">
						<span class="name">{{it.name}}</span>
						<span v-show="it.status!='已考试'">（{{it.status}}）</span>
					</div>
					<p class="addr" v-show="it.status=='已考试'">最高分 ：{{it.highestscore}}</p>
				</a>
			</template>
		</div>
		<no-content v-show="placelistTwo.length==0 "></no-content>
	</div>
</template>

<script>
	import $ from 'jquery';
	import methods from '../../../methods';
	import cHeader from '../../header';
    import noContent from '../../no_content.vue';
	import { mapState, mapActions } from 'vuex';

	export default {
		data() {
			return {
				placelistTwo: [],
				loading: 0,
				page: 1
			}
		},
		components: {
			cHeader,
			noContent
		},
		created() {},
		mounted() {

			let self = this;

			this.post('/ckexamapply/querymylearn', {
				command: "ckexamapply/querymylearn",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
				uid: $.cookie('uid')
			}).done(function(data) {
				self.placelistTwo = JSON.parse(data.learnlist);
				for(var i = 0; i < self.placelistTwo.length; i++) {
					if(self.placelistTwo[i].status == 1) {
						self.placelistTwo[i].status = "可报名";
					} else if(self.placelistTwo[i].status == 2) {
						self.placelistTwo[i].status = "已报名";
					} else if(self.placelistTwo[i].status == 3) {
						self.placelistTwo[i].status = "未开放";
					} else {
						self.placelistTwo[i].status = "已考试";
					}
				}
			});
		},
		/*computed: mapState([
		    'loginUser'
		]),*/
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
				window.location.href = '/pages/futuredoctorapp/application.html';
			},
			loadData() {

			}
		}
	}
</script>
<style lang="scss">

</style>