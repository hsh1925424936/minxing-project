<template>
	<div class="examtheory">
		<p class="nav"><span class="blue" @click="goback">考试&试卷</span> > 查看考试</p>
		<div class="content">
			<p class="top">
				<span>考试名称：{{examname}}</span>
				<span>课程：{{coursename}}</span>
				<span>考试类型：{{type|typefn}}</span>
				<span>考试形式：{{model|modelfn}}</span>
				<span>考试时间：{{time}}</span>
				<span>试卷名称：{{papername}}</span>
			</p>
			<div class="bottom">
				<div class="line">
					<el-table :data="stuscorelist" border style="width: 100%">
				      <el-table-column type="index" label="序号" width="150"></el-table-column>
				      <el-table-column prop="name" label="考生姓名"></el-table-column>
				      <el-table-column prop="username" label="学号"></el-table-column>
				      <el-table-column prop="score" label="成绩"></el-table-column>
				      <el-table-column label="状态">
				      	<template scope="scope">{{scope.row.status|statusfn}} </template>
				      </el-table-column>
				      <el-table-column prop="gradetime" label="评分时间"></el-table-column>
				      <el-table-column label="操作">
				      	<template scope="scope">
					        <el-button size="small" @click="checkpaper(scope.row)">查看</el-button>
					    </template>
				      </el-table-column>
				    </el-table>
			    </div>
			    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentpage" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
	    		</el-pagination>
	    		<p class="page"><el-button @click="goback">返回</el-button></p>
			</div>
		</div>
	</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import $ from 'jquery'
export default {
	
data() {
  	return {
  		examid:this.$route.query.examid,//考试信息
  		time:'',//考试时间
  		papername:'',//试卷名称
  		coursename:'',//课程名
  		type:'',//考试类型
  		model:'',//考试形式
  		examname:'',//考试名
  		stuscorelist:[],//考生列表
  		currentpage:1,
  		pagesize:10,
  		total:10,
  	}
},
filters:{
	statusfn:function(value){
		var status=value;
		switch (value){
			case -1: status="待考试";
				break;
			case 0: status="待考试";
				break;
			case 1: status="待评卷";
				break;
			case 2: status="已结束";
				break;
			default:
				break;
		}
		return status;
	},
	typefn:function(value){
		var type=value;
		switch (value){
			case 0: type="单元考试";
				break;
			case 1: type="期中考试";
				break;
			case 2: type="期末考试";
				break;
			case 3: type="随堂小测";
				break;
			default:
				break;
		}
		return type;
	},
	modelfn:function(value){
		var model=value;
		switch (value){
			case 0: model="理论笔试";
				break;
			case 1: model="理论机试";
				break;
			case 2: model="操作考试";
				break;
			default:
				break;
		}
		return model;
	}
},
mounted(){
	this.queryexamdetail();
	this.querystuscorelist(this.currentpage,this.pagesize);
},
methods:{
	handleSizeChange(val) {//分页每页条数
	    this.pagesize=val;
		this.querystuscorelist(this.currentpage,this.pagesize);
	},
	handleCurrentChange(val) {//分页当前页
	    this.currentpage=val;
		this.querystuscorelist(this.currentpage,this.pagesize);
	},
	queryexamdetail(){//查询考试详情
		var self=this;
		post('/unifyexam/queryexamdetail',{
            command:"unifyexam/queryexamdetail",
            loginid:getCookie('uid'),
            sessionid:getCookie('sid'),
            teacherid:getCookie('uid'),
            examid:self.examid
        }).done((res)=>{
            if(res.errcode==0){
            	self.time=res.starttime+'-'+res.endtime.slice(11,19);
            	self.papername=res.papername;
            	self.examname=res.name;
            	self.coursename=res.coursename;
            	self.type=res.type;
            	self.model=res.model;
            }
        })
	},
	querystuscorelist(currentpage,pagesize){//查询考生详情
		var self=this;
		post('/unifyexam/querystuscorelist',{
            command:"unifyexam/querystuscorelist",
            loginid:getCookie('uid'),
            sessionid:getCookie('sid'),
            teacherid:getCookie('uid'),
            examid:self.examid,
            pagenum:currentpage,
            pagesize:pagesize
        }).done((res)=>{
            if(res.errcode==0){
            	self.stuscorelist=res.scorelist;
            	self.total=res.totalcount;
            }
        })
	},
	goback(){//返回
		this.$router.push({
		    name:'exam_test',
		    query:{
		    	
		    }
	    })
	},
	checkpaper(row){//查看考生试卷
		this.$router.push({
			name:"checkpaper",
			query:{
				examid:row.examid,
				paperid:row.paperid,
				stuid:row.stuid,
				name:row.name,
				username:row.username
			}
		})
	}
}

}
</script>

<style scoped>
.nav{
	font-size: 13px;
	margin: 5px 0;
}
.blue{
	color:#20a0ff;
	cursor: pointer;
}
.content{
	border: 1px solid #bfcbd9;
}
.top{
	border-bottom: 1px solid #bfcbd9;
	padding: 25px 0 0 25px;
}
.top span{
	margin: 0 50px 25px 0;
	width: 25%;
}
.bottom{
	padding-bottom: 50px;
}
.line{
	width: 90%;
	margin: 20px auto;
}
.page{
	margin: 40px 0;
	text-align: center;
}
</style>