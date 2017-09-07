<template>
	<div class="booking-lab-sel ">
		<div class="list lab-list g-main" v-infinite-scroll="loadData">
			<template v-for="(val,index) in placelistOne">
				<a class="item valign-center" @click="selLab(val)">
					<i class="iconfont icon-clock"></i>
					<div class="auto-width">
						<h3 class="name">{{val.name}}</h3>
						<p class="addr">{{val.placeinfo}}</p>
					</div>
					<div class="auto-width">
						<p class="addr">{{val.starttime|substr(0,16)}}-{{val.endtime|substr(11,5)}} </p>
					</div>
					<a><img src="../../../assets/images/icon_xiangyou.png" style="width: .15rem;" /></a>
				</a>
			</template>
		</div>
		<no-content v-show="placelistOne.length==0 "></no-content>
	</div>
</template>

<script>
	import $ from 'jquery';
	import methods from '../../../methods';
    import noContent from '../../no_content.vue';
	import { mapState, mapActions } from 'vuex';

	export default {
		data() {
			return {
				placelistOne: [],
				time: '',
				timeList: [],
				loading: 0,
				page: 1
			}
		},
		components: {
          noContent
		},
		created() {},
		mounted() {

			let self = this;

			this.post('/ckexamapply/querycklearn', {
				command: "ckexamapply/querycklearn",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
				uid: $.cookie('uid')
			}).done(function(data) {
				self.placelistOne = JSON.parse(data.learnlist);
				
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
				
			},
			loadData() {

			},
			selLab(booking) {
				
				this.$router.push({
					name: 'fdEnlistSure',
					query: {
						booking: booking
					}
				});
			}
		}
	}
</script>
<style lang="scss">

</style>