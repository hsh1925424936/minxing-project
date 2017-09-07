<template>
	<div class = "wapper">
		<!-- <div class="background"></div> -->
		<my-canvas :dotsNum='dotsNum' :isColor='false' roundColor="#53B6FF" lineColor='#30A7FF'></my-canvas>
		<div class="title">
			<h1>教师云助手</h1>
			<p>建智慧医教&emsp;为明日良医</p>
		</div>
		<div class = "loginForm">
			<p>请登录</p>
			<div>
				<input type="text" name="username" placeholder='请输入用户名' v-model='loginForm.name'>
			</div>
			<div>
				<input type="password" name="password" placeholder='请输入密码' v-model="loginForm.password">
			</div>
			<el-button type="primary" style = "width:100%" @click="onSubmit" :disabled='disabled'>登录</el-button>
		</div>
		<div class="footer">
			<p>
				敏行医学 版权所有<br>Copyringht &copy; 2016 MIS Medical.All
				Right Reserved.
			</p>
		</div>
	</div>
</template>
<script >
	import myCanvas from '../components/canvas'
	import {post,setCookie,getCookie,setTitle} from '../config/util'
	import　{mapState,mapMutations} from 'vuex';
	import $ from 'jquery'
	export default{
		components:{
			myCanvas
		},
		data(){
			return{
				loginForm:{
					name:'',
					password:'',
				},
				dotsNum:100,
				disabled:false
			}
		},
		mounted(){
			setTitle('登录助教系统')
		},
		computed:{

		},
		methods:{
			onSubmit(){
				let self = this;
				self.disabled = true
				setTimeout(function() {
					self.disabled = false
				}, 3000);
				if(self.loginForm.name == ''){
					self.$message.error('用户名不能为空！');
				}else if(self.loginForm.password == ''){
					self.$message.error('密码不能为空！')
				}else{
					post('/usr/login', {
						command: 'usr/login',
						accountname: self.loginForm.name,
						password: self.loginForm.password,
						type: 100
					})
					.done(function(data, status, jqXhr){

						if(data && data.errcode == 0) {
							console.log('aaa')
							setCookie("uid",data.userid);
							setCookie("sid",data.sessionid);
							setCookie("name",data.name);
							console.log('aab')
							self.$router.push({
								name:'prepare_list'
							});

							self.$message({message:'登录成功！',duration:1000,showClose:true,type:'success'});

						}else if(data && data.errcode == 9901){
							self.$message.error('服务器响应失败，请稍后重试！')
						}else {
							self.$message.error('用户名或密码错误！');
						}
					})
					.fail(function(jqXhr, status, e){

						self.$message.error('服务器响应失败，请稍后重试！');

					});

			}
		},
	}
	}
</script>
<style scoped>
	.wapper{
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		overflow-y: hidden;
	}
	.title{
		position: absolute;
		width: 100%;
		top:12vh;
	}
	.title h1{
		width: 100%;
		text-align: center;
		font-weight: normal;
		font-family: FZLTXHJW;
		color: #ffffff;
		font-size: 48px;
		text-shadow: 3px 5px 3px #7D9599; 
	}
	.title p{
		width: 100%;
		text-align: center;
		font-size: 24px;
		color: rgba(255,254,254,0.9);
		text-shadow: 2px 3px 2px #999999;
		margin-top: 20px;
	}
	.loginForm{
		width: 390px;
		height:300px;
		margin:-50px auto;
		background-color: #ffffff;
		padding: 0 30px 20px;
		box-shadow: 0px 0px 2px #547888,0px 0px 2px #547888;
		/*box-shadow: -1px -1px 2px #547888;*/
		box-sizing: border-box;
		border-radius: 5px;
		position: relative;
		z-index:10;
		margin-top: 230px;
	}
	.loginForm p{
		width: 100%;
		height: 100px;
		line-height: 100px;
		font-size: 24px;
		color: #666666;
		text-align: center;
	}
	.loginForm div input{
		width: 100%;
		height: 35px;
		/*outline:#20A0FF solid thin;*/
		border: solid #20A0FF 1px;
		margin-bottom: 20px;
		padding-left: 30px;
		box-sizing: border-box;
		background-size: 6% 60%;
		background-repeat:no-repeat;
		background-position: 5px center;
		font-size:13px;
	}
	.loginForm div:nth-of-type(1) input{
		background-image: url(../assets/img/zhanghao.png);
	}
	.loginForm div:nth-last-of-type(1) input{
		margin-bottom: 30px;
		background-image: url(../assets/img/mima.png);
	}
	.elInputStyle{
		position: relative;
	}
	.elInputStyle img{
		width: 20px;
		height: 20px;
		position: absolute;
		top:0;
		left: 0;
		z-index: 10;
	}
	.footer{
		position: absolute;
		width: 100%;
		text-align: center;
		bottom: 50px;
		color: rgb(159,159,159);
	}
</style>