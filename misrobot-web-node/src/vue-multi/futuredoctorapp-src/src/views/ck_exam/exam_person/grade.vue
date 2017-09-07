<template>
	<div class="g-gradeover">
		<div style='position:fixed;top:0;width:100%;border: solid 1px #3499DB;'>	
			<c-header>
           		<div slot="headerLeft">
                	<a @click="back()" class="header-back-btn">
                    	<img src="../../../assets/images/icon_fanhui.png" />
                	</a>
            	</div>
            	出科考试教学评教
       		</c-header>
		</div>
		
       <div style="margin-top: 0.76rem;">
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
	 		<p class="examtext">请您对本次教学活动总体进行评价</p>
	 		<div class="stars">
	 			<img :src="star_img" @click="init(1)">
				<img :src="star_img" @click="init(2)">
				<img :src="star_img" @click="init(3)">
				<img :src="star_img" @click="init(4)">
				<img :src="star_img" @click="init(5)">
				<span class="assess" style="margin-top: 0.3rem;"></span>
	 		</div>
 		</div>
 		<div id="deficiency" class="deficiency">
	 		<div id='shadow1' v-show='isshadow1'>
	 		<p class="defitext">指出不足</p>
			<ul class="less">
				<li v-for="(value2,index2) in evaluations" class="change" @click="togger1()" :data-id=value2.id>{{value2.title}}</li>
			</ul>
	 		<textarea class="evaluate" v-model="comment" maxlength="200" placeholder="其他评价"></textarea>
	 		<a class="btn btn-blue btn-lg btn-block" @click="save()"> 确认评价 </a>
	 		</div>
	 		<div id='shadow2' v-show='isshadow2'>
	 		<p class="defitext">指出不足</p>
			<ul class="less">
				<li v-for="(value2,index2) in evaluations" class="change" @click="togger1()" :data-id=value2.id>{{value2.title}}</li>
			</ul>
	 		<textarea class="evaluate" v-model="comment" maxlength="200" placeholder="其他评价"></textarea>
	 		<a class="btn btn-blue btn-lg btn-block" @click="save()"> 确认评价 </a>
	 		</div>
	 		<div id='shadow3' v-show='isshadow3'>
	 		<p class="defitext">指出不足</p>
			<ul class="less">
				<li v-for="(value2,index2) in evaluations" class="change" @click="togger1()" :data-id=value2.id>{{value2.title}}</li>
			</ul>
	 		<textarea class="evaluate" v-model="comment" maxlength="200" placeholder="其他评价"></textarea>
	 		<a class="btn btn-blue btn-lg btn-block" @click="save()"> 确认评价 </a>
	 		</div>
	 		<div id='shadow4' v-show='isshadow4'>
	 		<p class="defitext">指出不足</p>
			<ul class="less">
				<li v-for="(value2,index2) in evaluations" class="change" @click="togger1()" :data-id=value2.id>{{value2.title}}</li>
			</ul>
	 		<textarea class="evaluate" v-model="comment" maxlength="200" placeholder="其他评价"></textarea>
	 		<a class="btn btn-blue btn-lg btn-block" @click="save()"> 确认评价 </a>
	 		</div>
	 		<div id='shadow5' v-show='isshadow5'>
	 		<p class="defitext">夸夸老师吧</p>
			<ul class="less">
				<li v-for="(value2,index2) in evaluations" class="change" @click="togger1()" :data-id=value2.id>{{value2.title}}</li>
			</ul>
	 		<textarea class="evaluate" v-model="comment" maxlength="200" placeholder="其他评价"></textarea>
	 		<a class="btn btn-blue btn-lg btn-block" @click="save()"> 确认评价 </a>
	 		</div>
 		</div>
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
		data() {
			return{
			isshadow1:false,
			isshadow2:false,
			isshadow3:false,
			isshadow4:false,
			isshadow5:false,
			suggestlist:[],
			learnname:'',
			stunames:[],
			teacherame:'',
			starttime:'',
			displayname:'',
			examplace:'',
			examinfo:'',
			count:'',
			comment:'',
			star_img:require('../../../assets/images/icon_star.png'),
			staron_img:require('../../../assets/images/icon_star_on.png'),
			evaluationitem:[],//评分项目数组
			evaluations:[],
			}
		},
		mounted() {
			var self = this
            this.registerToNative('goBack', function (data) {
            self.back()
            })
		},
		components: {
			cHeader
		},
		created (){
			this.examinfo=this.$route.query.examinfo;
			console.log(JSON.stringify(this.examinfo))
			if(this.examinfo.placeid==-1){
			this.examplace=this.examinfo.placeinfo
			}else{
				this.examplace=this.examinfo.displayname
			}
		},
		watch:{
			count:function(){//点击星星的时候先请求，然后赋值，然后返回标签
				var self=this
                this.post('/ckevaluation/queryevaluationinfo', {
                    command: 'ckevaluation/queryevaluationinfo',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                   	paraentscore:self.count,
                }).done(function (data) {
					console.log(data)
                    self.evaluations=data.evaluations
					console.log(self.evaluations)
                });

				// var data={
				// 	command:'ckevaluation/queryevaluationinfo',
				// 	sessionid:xiefn.getCookie('sid'),
				// 	loginid:xiefn.getCookie('uid'),
				// 	paraentscore:self.count,
				// }
				// console.log(JSON.stringify(data))
				// function callback(res){
				// 	console.log(JSON.stringify(res))
				// 	self.evaluations=res.evaluations
				// }
				// xiefn.post('/ckevaluation/queryevaluationinfo',data,callback,xiefn.errcodefn,xiefn.errfn)
			}
		},
		methods: {
			...methods,
			init:function(index){
				var self=this
				var star=self.star_img;	//普通灰色星星图片的存储路径
				var starRed=self.staron_img;//红色星星图片存储路径
				var prompt=['各方面都很差','不足处较多','一般,需要改善','比较满意,但仍可改善','非常满意,无可挑剔'];
				if(index==1){
					self.isshadow1=true;
					self.isshadow2=false;
					self.isshadow3=false;
					self.isshadow4=false;
					self.isshadow5=false;
				}else if(index==2){
					self.isshadow1=false;
					self.isshadow2=true;
					self.isshadow3=false;
					self.isshadow4=false;
					self.isshadow5=false;
				}else if(index==3){
					self.isshadow1=false;
					self.isshadow2=false;
					self.isshadow3=true;
					self.isshadow4=false;
					self.isshadow5=false;
				}else if(index==4){
					self.isshadow1=false;
					self.isshadow2=false;
					self.isshadow3=false;
					self.isshadow4=true;
					self.isshadow5=false;
				}else if(index==5){
					self.isshadow1=false;
					self.isshadow2=false;
					self.isshadow3=false;
					self.isshadow4=false;
					self.isshadow5=true;
				}
				$('.stars>img').attr('src',star);//当“回滚”、“改变主意”时，先复位所有图片为木有打星的图片颜色
				$('.less>li').removeClass("lessbgc")
				$(event.target).attr('src',starRed);//设置鼠标当前所在图片为打星颜色图
				self.count=index
				$(event.target).prevAll().attr('src',starRed);//设置鼠标当前的前面星星图片为打星颜色图
				$(event.target).siblings('span').text(prompt[index-1]);		//根据id的索引值作为数组的索引值
			},
			togger1:function(){
				$(event.target).toggleClass("lessbgc");
			},
//			show_exam:function(){
//				var self=this
//				var data={
//					command:'examapply/queryevaluationbyid',
//					sessionid:xiefn.getCookie('sid'),
//					loginid:xiefn.getCookie('uid'),
//					id:self.examid,
//				}
//				function callback(res){
//					self.learnname=res.learnname;
//					self.teacherame=res.teacherame;
//					self.stunames=res.stunames;
//					self.starttime=res.starttime;
//					self.displayname=res.displayname;
//				}
//				xiefn.post('/examapply/queryevaluationbyid',data,callback,xiefn.errcodefn,xiefn.errfn)
//			},
//			show_msg:function(){
//
//			},
//			getcolor:function(){
//				var self=this;
//				var a=$('.less>li');
//				for (let i in a){
//					if (a[i].hasClass('lessbgc')){
//						self.evaluationitems.push($(a[i]).data(id))
//					}
//				}
//			}
			save:function(){
				var self=this
				$('.lessbgc').each(function(index){
					self.evaluationitem.push({evaluationconfid:$('.lessbgc')[index].getAttribute('data-id')});
				})

				var self=this
                this.post('/ckexamapply/submitevaluation', {
                    command: 'ckexamapply/submitevaluation',
                    sessionid:xiefn.getCookie('sid'),
					loginid:xiefn.getCookie('uid'),
					uid:xiefn.getCookie('uid'),
					examid:self.examinfo.id,
					score:self.count,
					comment:self.comment,
					evaluationitems:self.evaluationitem,
                }).done(function (data) {
					self.$router.push({
                        name:'fdgradeover',query:{examinfo:self.examinfo,from:'grade'}
                    });
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
				// function callback(res){
				// 	self.$router.push({
                //         name:'fdgradeover',query:{examinfo:self.examinfo,from:'grade'}
                //     });
				// }
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
	.lessbgc{
		background-color: #6EC5FF;
		color: white;
	}
	.examtable{
		background-color: #3499DB;
		color: white;
		padding-left: 0.2rem;
		padding-top: 0.2rem;
	}
	.examtext{
			text-align: center;
			padding-top: 0.25rem;
			margin-top: 0.2rem;
	}
	.assess{
		margin-top: 0.25rem;
		color:rgb(255,218,88);
	}
	.stars{
		width:70%;
		margin:0 auto;
		overflow: hidden;
		text-align: center;
		/*margin-bottom:0.3rem;*/
	}
	.stars>img{
		width:14%;
		display:block;
		margin:0 3%;
		float:left;
	}
	.star{
		background-color: white;
		margin-top: 0.2rem;
		height: 2.8rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding:0.2rem 0;
	}
	.button{
		margin-top: 0;
		width: 100%;
		height: 1rem;
		left:0;
		position: relative;
		/*position: absolute;*/
		/*left: 2.5%;*/
		/*bottom: 0.11rem;*/
	}
	.deficiency{
		text-align: center;
		background-color: white;
		height: 56%;
		margin-top:0.2rem;
		padding: 0.2rem;
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
			float:left;
			border:0.01rem solid #C7C7C7;
			border-radius: 0.3rem;
			margin-left: 0.05rem;
			margin-top: 0.1rem;
			margin-right: 0.08rem;
			font-size: 0.2rem;
			padding: 0.1rem;
	}
	.evaluate{
		width: 100%;
		margin:0.3rem auto;
		display:block;
		min-height:1rem;
		/*margin-top:30px;*/
		padding:0.1rem 0.2rem;
		outline:none;
		resize:none;
		border:solid 0.01rem #C7C7C7;
	}
</style>
