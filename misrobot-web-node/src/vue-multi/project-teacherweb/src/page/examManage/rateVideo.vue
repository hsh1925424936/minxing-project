<template>
<div>
	<div>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/examManage/examManage' }">考试&试卷</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'det_operate',params:{examid:examid} }">查看考试</el-breadcrumb-item>
          <el-breadcrumb-item>操作题打分</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
	<div class = "show-video" >
		<video
			style="width:100%;height:100%"
		    id="my-player"
		    
		    controls
		    preload="auto"
		    poster=""
		    data-setup='{}'>
		  <source :src="videoUri" type="video/mp4"></source>
		  <!-- <source src="http://vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
		  <source src="http://vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source> -->
		  <p class="vjs-no-js">
		    To view this video please enable JavaScript, and consider upgrading to a
		    web browser that
		    <a href="http://videojs.com/html5-video-support/" target="_blank">
		      supports HTML5 video
		    </a>
		  </p>
		</video>
	</div>
	<!-- <div class = "tip">如果无法在线观看，您可以<span @click = "downloadVideo" style="color:#0497cb;cursor: pointer;">下载视频</span></div> -->
	<div class = "rating-table">
		<div class = "rating-info-top">
			<span>学生姓名：{{username}}</span>
			<span>学号：{{stuno}}</span>
			<span>上传时间：{{createtime}}</span>
			<span v-if="scoreid!=null">评分值：{{score}}</span>
			<span v-else>评分值：{{doTotalScore}}</span>
			<!-- <el-button v-if="scoreid!=null" type = "primary">下载评分表</el-button> -->
			<el-button v-if="scoreid==null" type = "primary" @click = "submitRate">提交</el-button>
		</div>
		<div class = "rating-info-detail">
			<div class = "question-item" v-for="(item,index) in operationList">
				<p class = "question-item-title">{{index+1+'.'+item.key+'('+item.sum+'分)'}}</p>
				<div v-for="(it,idx) in item.value">
					<p class = "question-item-detail">{{it.rightoperation}}</p>
					<p v-if="scoreid!=null"class = "question-item-grade">{{showScoreList[index][idx].score.substr(0,3)+'分'}}</p>
					<el-input-number v-else style="float:right" size="small" :min="0" :max="it.gradeitemscore" :step="it.adjuststepunit" v-model="it.doScore"></el-input-number>
					<p v-if="scoreid==null" style = "float:right;margin-right:10px">{{it.gradeitemscore+'分'}}</p>
					
				</div>
			</div>
			
		</div>
	</div>
</div>	
</template>
<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import videojs from 'video.js'
	export default {
		data: function() {
	        return { 
	        	visible: false,
	        	videoUri:'',
	        	username:'',
	        	stuno:'',
	        	createtime:'',
	        	score:'',
	        	operationList:[],
	        	scoreList:[],
	        	scoreid:'',
	        	showScoreList:[],
	        	examid:'',
	        }
	      },
	      computed:{
	      	doScoreList(){
	      		let arr=[];
	      		this.operationList.forEach((item)=>{
  					item.value.forEach(it=>{
  						arr.push({itemno:it.itemno,score:it.doScore})
  					})
  					
  				})
  				console.log(arr)
  				return arr;
	      	},
	      	doTotalScore(){
	      		let sum =0
	      		this.doScoreList.forEach(item=>{
	      			sum+=item.score;
	      		})
	      		return sum;
	      	}
	      },
	      mounted(){
	      	this.videoUri = this.$route.query.videopath;
	      	this.username = this.$route.query.stuname;
	      	this.questionid = this.$route.query.questionid
	      	this.stuno = this.$route.query.code;
	      	this.createtime = decodeURIComponent(this.$route.query.answertime);
	      	this.score = this.$route.query.score;
	      	this.scoreid = this.$route.query.scoreid;
	      	this.examid = this.$route.query.examid;
	      	this.getRatingList();
	      	
	      	
	      },
	      methods:{
	      	
	      	downloadVideo(){
	      		window.open(this.videoUri)
	      	},
	      	getRatingList(){
	      		var self = this;
	      		post('/question/queryoperationv2',{
	      			"command": "question/queryoperationv2",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					questionid:this.questionid,
	      		}).done(data=>{
	      			if(data&&data.errcode==0){
	      				
	      				let sum = 0;
	      				data.list.forEach((item)=>{
	      					sum=0;
	      					item.value.forEach(it=>{
	      						sum+=it.gradeitemscore;
	      						if(it.deducting==''||it.deducting=='0'||it.deducting==null){
	      							it.doScore =0;
	      						}else{
	      							it.doScore =it.gradeitemscore;
	      						}
	      						
	      					})
	      					item.sum =sum;
	      				})
	      				self.operationList = data.list;
	      				console.log('operationlist')
	      				console.log(self.operationList)
	      				if(self.scoreid){
				      		self.getScoreList();
				      	}
	      			}else{
	      				self.$message.error('发生错误')
	      			}
	      		})
	      		
	      	},
	      	getScoreList(){
	      		var self = this;
	      		post('/grade/queryckscore',{
	      			"command": "grade/queryckscore",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					scoreid:this.$route.query.scoreid
	      		}).done(data=>{
	      			if(data&&data.errcode==0){
	      				self.scoreList = data.queryresult;
	      				self.changeScoreList();
	      			}else{
	      				self.$message.error('发生错误')
	      			}
	      		})
	      		
	      	},
	      	changeScoreList(){
	      		let arr =[];
	      		
	      		let index=0;
	      		console.log('operationlist')
	      		this.operationList.forEach(item=>{
	      			let temp =[];
	      			arr.push(temp);
	      			item.value.forEach(it=>{
	      				temp.push(this.scoreList[index]);
	      				index++;
	      			})
	      			console.log(temp)
	      		})
	      		this.showScoreList = arr;
	      		console.log("arr")
	      		console.log(arr)
	      	},
		    submitRate(){
		    	let self = this;
		    	 this.$confirm('是否确认提交打分成绩?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			        post('/unifyexam/operatorgrade',{
			    		"command": "unifyexam/operatorgrade",
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						id:this.$route.query.id,
						"examid": this.$route.query.examid,
						"questionid": this.questionid,
						"stuid": this.$route.query.stuid,
						"total": this.doTotalScore,
						"scoresheetcode":this.operationList[0].value[0].scoresheetcode,
						"itemlist": this.doScoreList,

			    	}).done(data=>{
			    		if(data&&data.errcode==0){
			    			self.$alert('提交成功，点击确定返回考试列表！','提示',{type:'warning'}).then(()=>{self.$router.push({name:'det_operate',params:{examid:this.$route.query.examid}})});
			    		}
			    	})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消提交'
		          });          
		        });
		    	
		    	
		    }
	      }

	}
</script>
<style >
	.show-video{
		margin:20px 10px 0 0;
		float:left;
		width:49%;
		height:550px;
	}
	.rating-table{
		float:left;
		width:49%;
		margin-top:20px;
		border:1px solid #cccccc;
		height: 550px;
		overflow-y: scroll;
	}
	.rating-info-top{
		
		border-bottom:1px solid #cccccc;
		padding: 10px;

	}
	.rating-info-top>span{
		width:40%;
	}
	.rating-info-detail{
		min-height: 300px
	}
	.question-item{
		margin:10px 0;
		padding:0 10px;
	}
	.question-item-title{
		font-size: 18px;
		font-weight: bold;

	}
	.question-item-detail{
		display: inline-block;
		width:70%;
		margin:7px 0;
	}
	.question-item-grade{
		display: inline-block;

		float:right;
	}
</style>