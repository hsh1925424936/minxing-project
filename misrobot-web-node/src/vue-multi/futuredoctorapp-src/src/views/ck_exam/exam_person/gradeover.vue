<template>
	<div class="g-wrapper">
		<div style="position: fixed;top: 0;width:100%;border: solid 1px #3499DB;">
			<c-header>
           		<div slot="headerLeft">
                	<a @click="back()" class="header-back-btn">
                    	<img src="../../../assets/images/icon_fanhui.png" />
                	</a>
            	</div>
            	出科考试教学评课
       		</c-header>
		</div>
       <div style="margin-top: 0.76rem;" class="g-main">
 		<div class="examtable">
			<dl>
				<dd>
                   <span class="d-left">考试科目:</span>
                    <span>{{examinfo.learnname}}</span>
                   <!-- <span>导尿术</span>-->
                </dd>
				<dd>
					<span class="d-left">考官姓名:</span>
					<span>{{examinfo.teachername}}</span>
				</dd>
				<dd>
					<span class="d-left">考生姓名:</span>
					<span class="d-right" v-for="(value,index) in examinfo.stunames">{{value.name}}&nbsp;</span>
				</dd>
				<dd>
					<span class="d-left">考试时间:</span>
					<span class="d-right">{{examinfo.starttime | substr(0, 16)}}-{{examinfo.endtime | substr(11, 5)}}</span>
				</dd>
				<dd>
					<span class="d-left">考试场地:</span>
					<span class="d-right">{{examplace}}</span>
				</dd>
			</dl>
			<hr style="height: 1px;background-color: lightgray;margin-top: .2rem;" />
		</div>
		<div id="star" class="star">
	 		<p class="examtext">本次教学活动的总体评价</p>
	 		<div class="stars">
	 			<img :src="star_img">
				<img :src="star_img">
				<img :src="star_img">
				<img :src="star_img">
				<img :src="star_img">
	 		</div>
			<div class="sugtext">
 			<img src="../../../assets/images/biaoqian-xiao.png" />
 			<p class="titleext">
 			<span v-for="(value,index) in evaluations">{{value.title}}&nbsp;&nbsp;</span>
 			</p>
			</div>
 			<span class="sugtext12">&nbsp;&nbsp;{{comment}}</span>
 		</div>
	</div>
	<div class="padding">
			<a class="btn btn-blue btn-lg btn-block" @click="back()"> 返回首页 </a>
    </div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import cHeader from '../../header';
	import $ from "jquery";
	import methods from '../../../methods'
    import xiefn from '../../../vuex/xie';
	export default {
		props: ['active'],
		data() {
			return{
			examinfo:'',
			evaluations:[],
			star_img:require('../../../assets/images/icon_star.png'),
			staron_img:require('../../../assets/images/icon_star_on.png'),
			comment:'',
			examplace:'',
            frominfo:true
			}
		},
		mounted() {
			var self = this
            this.registerToNative('goBack', function (data) {
            self.back()
            });
			this.show_msg();
		},
		components: {
			cHeader
		},
		created (){
            if (this.$route.query.from!=='grade'){
                this.frominfo=false
            }
			this.examinfo=this.$route.query.examinfo;
			console.log(JSON.stringify(this.examinfo))
			if(this.examinfo.placeid==-1){
			this.examplace=this.examinfo.placeinfo
			}else{
				this.examplace=this.examinfo.displayname
			}
		},
		methods: {
			...methods,
			show_msg:function(){
				let self=this;
                this.post('/ckexamapply/queryevaluation', {
                    command: 'ckexamapply/queryevaluation',
                    sessionid:xiefn.getCookie('sid'),
					loginid:xiefn.getCookie('uid'),
					examid:self.examinfo.id,
                }).done(function (res) {
					self.evaluations=res.evaluationitems
					self.init(res.score);
					self.comment=res.comment
                });
			},
			init:function(index){
				var self=this
				var starRed=self.staron_img;//红色星星图片存储路径
				if(index<5){
				$('.stars>img').eq(index).prevAll().attr('src',starRed);//设置鼠标当前的前面星星图片为打星颜色图
				}else{
					$('.stars>img').attr('src',starRed);
				}
			},
            back(){
                this.$router.push({
                    name: 'fdtourexaminer'
                })
            },
		},
	}
</script>
<style scoped>
	.examtable{
		background-color: #3499DB;
		color: white;
		padding-left: 0.2rem;
		padding-top: 0.2rem;
	}
	.examtext{
			text-align: center;
			padding-top: 0.25em;
			margin-top: 0.2rem;
	}
	.stars{
		width:70%;
		margin:0 auto;
		overflow: hidden;
	}
	.stars>img{
		width:14%;
		display:block;
		margin:0 3%;
		float:left;
	}
	.star{
		background-color: white;
		margin-top: 0.1rem;
		height: auto;
	}
	.titleext span{
		margin-bottom: 0.1rem;
	}
	.sugtext{
		width:70%;
		margin:0 auto;
		overflow:hidden;
		margin-top:.22rem;
	}
	.sugtext>img{
		float:left;
		width:8%;
		margin:0 6%;
	}
	.sugtext>p{
		float:left;
		width:80%;
		padding-left: 0.01rem;
	}
	.sugtext12{
		margin-top: 0.22rem;
		word-break:break-all;
		padding-left: 0.22rem;
		padding-right: 0.22rem;
	}
</style>
