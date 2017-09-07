<template>
	<div class='g-wrapper'>
		<!--<div class="nav" style="background:rgb(52,153,219);text-align:center;color: white;">
			{{name}}
		</div>-->
		<c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
			</div>
			<div style="width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
				{{name}}
			</div>
            
        </c-header>
		<div class="g-main" v-if='!noContent'>
			<div class="header">
				{{instruction}}
			</div>
			<div class="list" v-for="(item,index) in evaluationlist">
				<h2><span v-if="item.required == 0" style="color:red;">*</span>{{index+1}}、{{item.content}}
					<span v-if="item.type == 1">(单选题)</span>
					<span v-if="item.type == 2">(多选题)</span>
				</h2>
				<div class="flex" :class="{padding:item.type == 1 || item.type == 2}">
					<div v-for="(v,key) in item.items" :class="{text:item.type == 3}">
							<label v-if="item.type == 1" class="label">
								<input type="radio" class="radio" :class="{'v-checked':v.checked}" :name='index' @click="select(v,item,index,key)"><span v-if="v.code">{{v.code}}、</span><span>{{v.content}}</span>
							</label>
							<label :for="v.id" v-if="item.type == 2"  class="label">
								<input :id="v.id" type="checkbox" class="checkbox" @click="select(v,item)">{{key+1}}、{{v.content}}
							</label>
						<p v-if="item.type == 3">
							<textarea v-model='textarea[index]' placeholder="200字以内" class="textarea"
							@input='textareaInput(index)' @blur="blur" @focus="focus"></textarea>
						</p>
					</div>
				</div>
				
			</div>
			<div class="submit">
				<a @click='submit'>提交</a>
			</div>
		</div>
		<no-content v-if='noContent'></no-content>
		<div class="loading" v-if="loading">
			<img src="../../assets/images/loading_more.gif" alt="">
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import cHeader from '../header'
	import methods from '../../methods'
    import noContent from '../no_content'
    import { mapState,mapActions } from 'vuex'
	export default {
		name:'survey_question',
		data(){
			return{
				textarea:[],
				name:'',
				instruction:'',
				noContent:false,
				evaluationlist:[
					// {
					// 	id:1,
					// 	title:'本次课程整体安排',
					// 	type:1,
					// 	required:0,
					// 	items:[
					// 		{
					// 			id:10,
					// 			name:'',
					// 			content:'非常赞同'
					// 		},
					// 		{
					// 			id:11,
					// 			name:'',
					// 			content:'赞同'
					// 		},
					// 		{
					// 			id:12,
					// 			name:'',
					// 			content:'一般或不确定'
					// 		},
					// 		{
					// 			id:13,
					// 			name:'',
					// 			content:'不太满意'
					// 		},
					// 		{
					// 			id:14,
					// 			name:'',
					// 			content:'不赞同'
					// 		},
					// 	]
					// },
					// {
					// 	id:2,
					// 	title:'您觉得本次培训的收益有哪些？',
					// 	type:2,
					// 	required:0,
					// 	items:[
					// 		{
					// 			id:20,
					// 			name:'',
					// 			content:'规范操作、纠正错误'
					// 		},
					// 		{
					// 			id:21,
					// 			name:'',
					// 			content:'同行交流获益'
					// 		},
					// 		{
					// 			id:22,
					// 			name:'',
					// 			content:'自信心增强'
					// 		},
					// 		{
					// 			id:23,
					// 			name:'',
					// 			content:'近期内将开展显微外科手术/增加手术量'
					// 		}
					// 	]
					// },
					// {
					// 	id:3,
					// 	title:'您觉得本次培训您想学到的最重要的东西是什么？',
					// 	type:3,
					// 	required:1,
					// 	items:[
					// 		{
					// 			id:30,
					// 			name:'',
					// 			content:''
					// 		}
					// 	]
					// },
					// {
					// 	id:4,
					// 	title:'本次培训班存在的不足及需要改进之处？',
					// 	type:3,
					// 	required:0,
					// 	items:[
					// 		{
					// 			id:40,
					// 			name:'',
					// 			content:''
					// 		}
					// 	]
					// },
				],
				items:[],
				required:[],
				loading:false,
			}
		},
		components:{
			cHeader,
			noContent
		},
		mounted(){
			let self = this
			this.init()
			self.registerToNative('goBack', function (data) {
                self.back();
			});
		},
		methods:{
			...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
			]),
			back(){
				location.href = '/pages/futuredoctorapp/todo.html'
			},
            init(){
            	let self = this
            	this.post('/commonNaire/queryNaireInfo',{
            		command:'commonNaire/queryNaireInfo',
            		sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
					naire_id:self.$route.query.naireId,
                    // naire_id:1
            	}).done(function(data){
					// console.log(data)
					if(data.naire_info){
						self.name = data.naire_info.title
						self.instruction = data.naire_info.comment
						self.evaluationlist = data.naire_info.items
						self.evaluationlist.map(function(item,index,arr){
							self.textarea[index] = ''
						})
						$('title').html(self.name)
						// console.log(self.evaluationlist)
					}else{
						self.noContent = true
					}
            	})
            },
			// textarea控制字体不超过200
			textareaInput(index){
				if(this.textarea[index].length > 200){
					this.textarea[index] = this.textarea[index].substr(0,200)
				}
			},
            // textarea失去焦点
            blur:function(){
            	$('.g-main').css("padding-bottom",'0')
            },
            // textarea获得焦点时
            focus:function(){
            	$('.g-main').css("padding-bottom",'5rem')
            },
			// 点击单选或者多选时候
			select(v,item,index,key){
				let self = this
				if(item.type == 1){
					item.items.map(item1=>{
						if(item1!=v){
							if(item1.checked == 'undefined' || item1.checked == true){
								this.$set(item1,'checked',false)
							}
						}
					})
					if(typeof v.checked == 'undefined'){
						this.$set(v,'checked',true)
					}else{
						v.checked = !v.checked;
					}
				}else if(item.type == 2){
					if(typeof v.checked == 'undefined'){
						this.$set(v,'checked',true)
					}else if(v.checked){
						delete v.checked
					}
				}
			},
			 // 点击提交按钮
            submit:function(){
				let self = this
				self.items = []
				self.required = []
				this.evaluationlist.map(function(item,index,arr){
					delete item.checked
					if(item.required == 0 && item.type!= 3 && item.type != 4){
						item.items.map(function(item1,index1,arr1){
							if(item1.checked){
								self.$set(item,'checked',true)
							}
						})
					}
					if(item.required == 0 && typeof item.checked == 'undefined' && item.type != 3 && item.type != 4){
						self.required.push(index+1)
					}
					item.items.map(function(item2,index2,arr2){
						if(item2.checked){
							self.items.push({
								qust_id:item.id,
								opts_id:item2.id,
								content:''
							})
						}	
					})
					if(item.type == 3){
						self.items.push({
							qust_id:item.id,
							opts_id:item.items[0].id,
							content:self.textarea[index]
						})
					}
				})
				this.evaluationlist.map(function(item,index,arr){
					if(item.required == 0 && item.type == 3){
						if(typeof self.textarea[index] == 'undefined' || self.textarea[index].trim() == ''){
							self.required.push(index+1)
						}
					}
				})
				if(this.required.length != 0){
					this.toast('您还有第'+self.required.join(',')+'道题没有填写！')
				}else{
					this.showLoading = true
					this.post('/commonNaire/submitNaireResult', {
						command: 'commonNaire/submitNaireResult',
						sessionid: $.cookie('sid'),
						loginid: $.cookie('uid'),
						submitid: $.cookie('uid'),
						naire_id: self.$route.query.naireId,
						type: 0,
						source: 1,
						time: '',
						result_list: self.items,
						activityId:self.$route.query.activityId,
						objectId:self.$route.query.objectId,
						sourceid:self.$route.query.sourceid,
					}).done(function (data) {
						if (data.errcode == 0) {
							self.showLoading = false
							self.$router.push({
								name: "fdSurvey_question_submit",
								query: {
									name: self.name
								}
							})
						}
					}).fail(function (error) {
						console.log(error)
					})
				}
            },
		}
	}
	
</script>
<style scoped>
	.g-main{
		background: rgb(255,255,255)!important;
		font-size: 0.24rem;
		color: rgb(100,100,100);
	}
	.nav{
		height: 0.88rem;
		line-height: 0.88rem;
		font-size: 0.3rem;
	}
	.header{
		padding: 0.2rem;
		color: rgb(0,0,0);
		font-size: 0.26rem;
	}
	.list{
		border-top: solid 1px rgb(240,240,240);
		padding: 0.2rem 0.2rem 0.15rem;
		margin-bottom: 0;
	}
	.list h2{
		font-size: 0.24rem;
		font-weight: normal;
		color: rgb(0,0,0);
		margin-bottom: 0.1rem;
	}
	.list p{
		/*padding-left: 0.2rem;*/
		margin-top: 0.15rem;
	}
	.list input{
		margin-right: 0.1rem;
		position: relative;
		top:0.05rem;
	}
	.flex{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}
	.padding{
		padding: 0 0.3rem;
	}
	.text{
		width:100%;
	}
	.text p{
		width: 100%;
	}
	.textarea{
		background: #f2f2f2;
		width: 100%;
		height: 2rem;
		margin-top: 0.2rem;
		padding: 0.1rem;
		box-sizing: border-box;
	}
	.label{
		padding: 0 10px;
	}
	.checkbox{
		width:0.26rem;
		height: 0.26rem;
		background-image: url('../../assets/images/checkbox.png');
		border-radius: 0;
	}
	.checkbox:checked{
		background-image:url(../../assets/images/checkbox_on.png);
	}
	.radio {
        width: .3rem;
        height: .3rem;
        position: relative;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-radius: .15rem;
        border-top-left-radius: .15rem;
        border-top-right-radius: .15rem;
        border-bottom-left-radius: .15rem;
        border-bottom-right-radius: .15rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;
        background-image: url('../../assets/images/gouxuan.png');
        background-size: cover;
        margin-right: 0.05rem;
    }

    /* .radio:checked {
        background-image: url('../../assets/images/gouxuan_on.png');
        background-size: cover;
    } */
	.v-checked{
		 background-image: url('../../assets/images/gouxuan_on.png');
        background-size: cover;
	}
    .submit a{
    	width: calc(100% - 0.4rem);
    	height: 0.8rem;
    	color: white;
    	background: #3499db;
    	text-align: center;
    	line-height: 0.8rem;
    	font-size: 0.28rem;
    	margin:0.3rem 0.2rem 0.5rem;
    	border-radius: 0.1rem;
    }
     .fade-enter-active,
    .fade-leave-active {
        transition: all .5s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: all .5s;
    }

    .slide-enter,
    .slide-leave-active {
        transform: translateY(-100%);
        opacity: 0;
    }
	.modelDiv {
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        z-index: 100;
    }
    .content{
    	width: 4rem;
        height: 0.88rem;
    	line-height: 0.88rem;
    	position: absolute;
        top: calc(50% - 0.5rem);
        left:calc(50% - 2rem);
    	background: white;
    	text-align: center;
    	border-radius: 0.5rem;
    	padding: 0!important;
    }
	.loading{
		width: 100vw;
		height: 100vh;
		position: absolute;
		top:0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>