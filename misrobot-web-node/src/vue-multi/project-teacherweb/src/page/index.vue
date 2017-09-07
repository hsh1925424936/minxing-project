<template>
	<div class = "root">

			<div class = "header">
				<div class = "headerInner">
					<!-- <a href = "/pages/homepage/teacher.html" class = "head-title ">教师云助手</a> -->
					<a  class = "head-title ">教师云助手</a>
					<nav class = "head-nav">
						<!-- <router-link  to= "/" class = "head-nav-item">首页</router-link> -->
						<router-link :class ="{'current-menu':$route.path.indexOf('prepare')!=-1}" to = "/prepare/list" class = "head-nav-item">备课</router-link>
						<router-link :class ="{'current-menu':$route.path.indexOf('examManage')!=-1}" to = "/examManage/exam_test" class = "head-nav-item">试卷&考试</router-link>
						<router-link :class ="{'current-menu':$route.path.indexOf('report')!=-1}" to = "/report/allreport" class = "head-nav-item">教学报告</router-link>
						<router-link :class ="{'current-menu':$route.path.indexOf('filemanage')!=-1}" to = "/filemanage" class = "head-nav-item">文件管理</router-link>
						<router-link :class ="{'current-menu':$route.path.indexOf('qmanage')!=-1}" to = "/qmanage/qlist" class = "head-nav-item">题库管理</router-link>
					</nav>
					<div class = "user-info">
						<div class ="new-info el-icon-message" @click = "toNotification"></div>

						<img class = "user-image" :src = "headImg" @error = "defaultHead" @click = "topersonnalinfo"/>

						<div @mouseover= "showPersonal=true" @mouseout = "showPersonal=false" class = "user-name" :class = "{'user-name-hover':showPersonal}">{{username}}</div>
						<ul  @mouseover= "showPersonal=true" @mouseout = "showPersonal=false" :class ="{show:showPersonal}" class = "drop-down">
							<li><router-link to="/personalinfo">个人中心</router-link></li>
							<li><router-link to="/modifypassword">修改密码</router-link></li>
							<li @click = "logout"><a >退出</a></li>
						</ul>
					</div>
				</div>

			<div class = "fill">

			</div>
		</div>
		<div class = "main">
		<router-view></router-view>
		</div>
		<div class = "footer"></div>
	</div>
</template>
<script >
import {post,setCookie,getCookie,removeCookie,setTitle} from '../config/util'
export default {
        data() {
            return {
            	username:'',
            	headImg:require('../assets/img/headimg.png'),
            	showPersonal:false,
            }
        },
        components: {},
        created() {
        },
        mounted () {
        	this.username = getCookie('name');
        	this.getUserInfo();
        	this.$bus.$on('updateHeadImg',this.getUserInfo);
            setTitle('教师云助手')
        },

        methods: {
        	logout(){

		  		removeCookie("uid");
	            removeCookie("sid");
	            removeCookie("name");

	            this.$router.push({name:'Login'});
		  	},
		  	toNotification(){
		  		this.$router.push({path:'/notification'})
		  	},
		  	topersonnalinfo(){
		  		this.$router.push({path:'/personalinfo'})
		  	},
		  	getUserInfo(){
              let self = this;
              post('/teachingstaff/queryteacherinfo',{
                command:'teachingstaff/queryteacherinfo',
                loginid:getCookie('uid'),
                sessionid:getCookie('sid'),
                uid:getCookie('uid')
              }).done(data=>{
                if(data&&data.errcode==0){
                	console.log(data)
                  self.headImg = data.imageurl||require('../assets/img/headimg.png');
                }
              })
            },
            defaultHead(){
            	this.headimg =require('../assets/img/headimg.png');
            }
        }
    }
</script>
<style>
	.root{
		font-size:15px;
		/* background-color: #f7f8fa; */
	}
	.show{
		display: block !important;
	}
	.header{
		position: fixed;
		top:0px;
		width:100%;
	    background: #fff;
	    border-bottom: 1px solid rgba(30,35,42,.06);
	    box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
	    background-clip: content-box;
	    color:#8590a6;
	    z-index:100;
	    background-color: #20a0ff;
	}

	.headerInner{
		position: relative;
		display: flex;
		align-items: center;
		width:1280px;
		height:50px;
		margin:0 auto;
		padding:0 20px;
		color:#8590a6;
	}
	.head-title{
		font-weight: bold;
		width:130px;
		margin-right:132px;
		color:#fff;
		font-size: 21px;
	}
	.head-nav{

	}
	.head-nav-item{
		padding:15px;
		/* color:#8590a6; */
		color:#fff;
	}
	.current-menu{
		background: #1d8ce0;
	}
	.new-info{
		width:16px;
		height: 16px;
		color:white;
		margin-right:20px;
		cursor: pointer;
	}
	.user-info{
		display: flex;
		align-items: center;
		margin-left: 300px;
		position: relative;
	}
	.user-image{
		width: 30px;
		height:30px;
		cursor: pointer;
	}
	.user-name{
		width: 80px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    margin: 0 20px;
	    color: white;
	    height: 50px;
	    line-height: 50px;
	    padding: 0 20px;
	}

	.user-name:hover{
		background: #1d8ce0;
	}
	.user-name-hover{
		background: #1d8ce0;

	}
	.drop-down{
		display: none;
		position: absolute;
		top:50px;
		left:87px;
	}
	.drop-down li{
		display: block;
	    width: 80px;
	    height: 40px;
	    line-height: 40px;
	    padding:0 20px;
	    color: #fff;
	    text-decoration: none;
	    border-top: 1px solid #58b7ff;
	    box-shadow: 0 1px 1px rgba(0,0,0,.4);
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    cursor: pointer;
	    background-color:#1d8ce0;
	}
	.drop-down li a{
		color: #ffffff;
	}
	.drop-down li:hover{
		background: #20a0ff;
	}
	.main{
		box-sizing: border-box;
		min-height: 650px;
		width: 1280px;
		margin:50px auto 10px;
		padding-top: 20px;
		overflow:hidden;
		background: #fff;
	}
	.footer{
		width: 100%;
		height:10px;
		margin-bottom:-20px;
		display: block;
	}
</style>
