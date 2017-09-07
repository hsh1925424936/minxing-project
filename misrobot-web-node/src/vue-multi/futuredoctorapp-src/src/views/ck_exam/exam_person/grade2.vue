<template>
	<div class="g-wrapper">
		<c-header>
       		<div slot="headerLeft">
            	<a @click="back()" class="header-back-btn">
                	<img src="../../../assets/images/icon_fanhui.png" />
            	</a>
        	</div>
        	出科考试教学评教
       	</c-header>
       <div class='g-main'>
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
	 		<p class="examtext">请您对本次教学/考试总体进行评价</p>
	 		<div class="stars">
	 			<img :src="star_img" @click="init(1)">
				<img :src="star_img" @click="init(2)">
				<img :src="star_img" @click="init(3)">
				<img :src="star_img" @click="init(4)">
				<img :src="star_img" @click="init(5)">
	 		</div>
 		</div>
 		<div class="exambottom">
	 		<div class="estimate" v-for="(value,index) in evaluations" :data-id=value.id>
	 			<p>{{value.title}}</p>
		 		<div class="btn-bar btn-bar-full" id="pjbutton" style="padding:10px;">
					<p style="background: none!important;color: gray; margin-right: 0.2rem;">最差</p>
		 			<div class="btn" style="background-color: white;" @click="compont(value.id,index,1)">1</div>
		 			<div class="btn" style="background-color: white;" @click="compont(value.id,index,2)">2</div>
		 			<div class="btn" style="background-color: white;" @click="compont(value.id,index,3)">3</div>
		 			<div class="btn" style="background-color: white;" @click="compont(value.id,index,4)">4</div>
		 			<div class="btn" style="background-color: white;" @click="compont(value.id,index,5)">5</div>
					<p style="color: #6EC5FF;margin-left: 0.2rem;">最好</p>
				 </div>
	 		</div>
	 		<textarea class="evaluate" v-model="comment" maxlength="200" placeholder="可输入对本次教学/考试的意见或建议"></textarea>
 		</div>
	</div>
	<div class="padding">
        <a class="btn btn-blue btn-lg btn-block" @click="save()"> 确认评价 </a>
    </div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import cHeader from '../../header';
	import methods from '../../../methods'
	import $ from "jquery";
    import { mapState, mapActions } from 'vuex'
    import xiefn from '../../../vuex/xie';
	export default {
		data() {
			return{
			isshadow1:false,
			star_img:require('../../../assets/images/icon_star.png'),
			staron_img:require('../../../assets/images/icon_star_on.png'),
			count:'',
			evaluationitem:[],
			evaluationitem_obj:{},
			evaluations:[],
			examplace:'',
			comment:''
			}
		},
		components: {
			cHeader
		},
		mounted(){
			var self = this
            this.registerToNative('goBack', function (data) {
            self.back()
            });
		},
		created (){
			this.examinfo=this.$route.query.examinfo;
			console.log(this.examinfo)
			//console.log(JSON.stringify(this.examinfo))
			if(this.examinfo.placeid==-1){
			this.examplace=this.examinfo.placeinfo
			}else{
				this.examplace=this.examinfo.displayname
			}
		},
		watch:{
			count:function(){//点击星星的时候先请求，然后赋值，然后返回标签
				let _this=this;
                this.post('/ckevaluation/queryevaluationinfo', {
                    command: 'ckevaluation/queryevaluationinfo',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                   	paraentscore:_this.count,
                }).done(function (data) {
					console.log(data)
                    _this.evaluations=data.evaluations
                });
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
			init:function(index){
				var self=this
				var star=self.star_img;	//普通灰色星星图片的存储路径
				var starRed=self.staron_img;//红色星星图片存储路径
				$('.stars>img').attr('src',star);//当“回滚”、“改变主意”时，先复位所有图片为木有打星的图片颜色
				$(event.target).attr('src',starRed);//设置鼠标当前所在图片为打星颜色图
				self.count=index
				$(event.target).prevAll().attr('src',starRed);//设置鼠标当前的前面星星图片为打星颜色图
			},
			compont:function(id,index,score){
				this.evaluationitem_obj[id] = score;
				$(event.target).removeClass('btn-ge').siblings('div').removeClass('btn-ge');
				$(event.target).addClass(function(){
					return 'btn-ge';
				});
				$(event.target).prevAll().addClass('btn-ge');


			},

			save:function(){
				for ( var i in this.evaluationitem_obj ){
					this.evaluationitem.push({evaluationconfid:i,score:this.evaluationitem_obj[i]});
				}
//				console.log(JSON.stringify(this.evaluationitem_obj));
//				return
				let self=this;
                this.post('/ckexamapply/submitevaluation', {
                    command: 'ckexamapply/submitevaluation',
                    sessionid:xiefn.getCookie('sid'),
					loginid:xiefn.getCookie('uid'),
					uid:xiefn.getCookie('uid'),
					examid:self.examinfo.id,
					score:self.count,
					comment:self.comment,
					evaluationitems:self.evaluationitem,
					type:1,
                }).done(function (data) {
                	if(data.errcode==0){
					self.$router.push({
                        name:'fdgradeover2',query:{examinfo:self.examinfo,from:'grade'}
                    });
                	}else{
                		self.toast(data.errdesc);
                		self.evaluationitem=[];
                	}
                });

				// var data={
				// 	command:'ckexamapply/submitevaluation',
				// 	sessionid:xiefn.getCookie('sid'),
				// 	loginid:xiefn.getCookie('uid'),
				// 	uid:xiefn.getCookie('uid'),
				// 	examid:self.examinfo.id,
				// 	score:self.count,
				// 	comment:self.comment,
				// 	evaluationitems:self.evaluationitem,
				// }
				// console.log(data)
				// function callback(res){
					
				// }

				// // this.post('/ckexamapply/submitevaluation',data,callback);
				// xiefn.post('/ckexamapply/submitevaluation',data,callback,xiefn.errcodefn,xiefn.errfn)
			},
            back(){
                this.$router.push({
                    name: 'fdtourexaminer'
                })
            },
		}
	}

</script>
<style scoped>
	.nav{
		width: 100%;
		position: fixed;
		z-index: 20;
		border:solid 1px #3499DB;
	}
	.btn-ge{
		color:white;
		background-color: #6EC5FF!important;
	}
	#pjbutton .btn:nth-of-type(1){
		border-top-left-radius: 0.2rem;
		border-bottom-left-radius: 0.2rem;
	}
    #pjbutton .btn:nth-of-type(5){
		border-top-right-radius: 0.2rem;
		border-bottom-right-radius: 0.2rem;
	}
	.examtable{
		background-color: #3499DB;
		color: white;
		padding-left: 0.2rem;
		padding-top: 0.2rem;
	}
	.examtable dl dd{
		margin-bottom: .1rem;
	}
	.examtext{
			text-align: center;
			margin-bottom: 0.2rem;
			margin-top: 0!important;
	}
	.assess{
		margin-top: 0.25rem;
	}
	.stars{
		width:70%;
		margin:0 auto;
		overflow: hidden;
		text-align: center;
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
		height: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.button{
		margin-top: 15px;
		width: 95%;
		height: 1rem;
		position: relative;
		left: 2.5%;
		bottom: 0.01rem;
	}
	.deficiency{
		text-align: center;
		background-color: white;
		height: 56%;
	}
	.defitext{
			padding-top: 5px;
	}
	.less{
			overflow: hidden;
			width: 100%;
			height: 38%;
	}
	.less>li{
			width:30%;
			float: right;
			border:0.01rem solid #C7C7C7;
			border-radius: 0.6rem;
			margin-left: 0.05rem;
			margin-top: 0.1rem;
			padding-top: 0.1rem;
			padding-bottom: 0.08rem;
			margin-right: 0.08rem;
			font-size: smaller;
	}
	.evaluate{
		width: 100%;
		margin:0 auto;
		display:block;
		min-height:100px;
		margin-top:30px;
		padding:0;
		outline:none;
		resize:none;
		border:solid 0.01rem #C7C7C7;
		margin-bottom: 0.3rem;
		padding: 0.2rem 0.2rem;
	}
	.estimate{
			padding-top: 0.1rem;
			background-color:white;
			min-height: 70%;
		}
	.exambottom{
		margin-top: 0.1rem;
		background-color: white;
		padding: 0.3rem 0.3rem;
	}
	
</style>
