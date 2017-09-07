<template>
<div>
	<div>
		<el-breadcrumb separator=">">
		  <el-breadcrumb-item :to="{ path: '/report/allreport' }">考试报告</el-breadcrumb-item>
		  <el-breadcrumb-item>查看考试</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
	<div class = "exam-cpu">
		<div class = "exam-cpu-title">
			<span class="exam-cpu-title-item">考试名称：{{name}}</span>
			<span class="exam-cpu-title-item">课程：{{coursename}}</span>
			<span class="exam-cpu-title-item">考试类型：{{type}}</span>
			<span class="exam-cpu-title-item">考试形式：{{model}}</span>
			<span class="exam-cpu-title-item">考试时间：{{starttime}}</span>
			<span class="exam-cpu-title-item">考试试卷：{{papername}}</span>
			<el-button type = "primary" @click = "exportData">成绩导出</el-button>
		</div>
		<div class = "exam-cpu-grade">
			<!-- <div >考试地点：</div> -->
			<div style = "margin:10px 0;">考生成绩：</div>
			<el-table
			    ref="singleTable"
			    :data="scorelist"
			    border
			    style="width: 100%">
			    <el-table-column
			      type="index"
			      width="80"
			      label = "序号">
			    </el-table-column>
			    <el-table-column
			      property="name"
			      label="姓名"
			      >
			    </el-table-column>
			    <el-table-column
			      property="stuid"
			      label="学号"
			      >
			    </el-table-column>
			    <el-table-column
			      property="score"
			      label="成绩">
			    </el-table-column>
			    <el-table-column
			      property="statusinfo"
			      label="状态"
			      >
			    </el-table-column>
			    <el-table-column
			      property="gradetime"
			      label="评分时间"
			      >
			    </el-table-column>
			    <el-table-column label="操作">
			      <template scope="scope">
			        <el-button type="text" @click="toRatedPaper(scope.$index, scope.row)">查看</el-button>
			       </template>
			    </el-table-column>
			</el-table>
			<el-pagination
			style="margin-left:725px"
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pagenum"
		      :page-sizes="[10, 20, 50, 100]"
		      :page-size="pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="totalcount">
		    </el-pagination>
		</div>
	</div>
</div>
</template>
<script >
import {post,setCookie,getCookie,setTitle,exportExcel} from '../../config/util'

	export default {
        data() {
            return {
            	types:['单元考试','期中考试','期末考试','随堂小测'],
            	models:['理论笔试','理论机试','操作考试'],
            	name:'',
            	coursename:'',
            	type:'',
            	model:'',
            	starttime:'',
            	papername:'',
            	examid:'',
            	scorelist:[],
            	pagenum:1,
            	pagesize:10,
            	totalcount:0,
            }
        },
        components: {
        },
        created() {
        },
        mounted () {
        	this.examid = this.$route.params.examid;
        	this.getExamInfo();
        	this.getScoreList();
        },

        methods: {
        	exportData(){
        		let data ={
					command:'unifyexam/querystuscorelist',
        			loginid:getCookie('uid'),
        			sessionid:getCookie('sid'),
        			teacherid:getCookie('uid'),
        			examid:this.examid,
        			pagenum:this.pagenum,
        			pagesize:this.pagesize,
					};
		    	exportExcel(data);
        	},
        	getExamInfo(){
        		let self = this;
        		post('/unifyexam/queryexamdetail',{
        			command:'unifyexam/queryexamdetail',
        			loginid:getCookie('uid'),
        			sessionid:getCookie('sid'),
        			teacherid:getCookie('uid'),
        			examid:this.examid,
        		}).done(data=>{
        			if(data&&data.errcode==0){
        				self.name = data.name;
        				self.coursename = data.coursename;
        				self.type = self.types[data.type];
        				self.model = self.models[data.model];
        				self.starttime = data.starttime;
        				self.papername = data.papername;
        			}
        		})
        	},
        	getScoreList(option){
        		let self = this;
        		post('/unifyexam/querystuscorelist',{
        			command:'unifyexam/querystuscorelist',
        			loginid:getCookie('uid'),
        			sessionid:getCookie('sid'),
        			teacherid:getCookie('uid'),
        			examid:this.examid,
        			pagenum:this.pagenum,
        			pagesize:this.pagesize,
        			...option
        		}).done((data)=>{
        			if(data&&data.errcode==0){
        				self.scorelist = data.scorelist;
        				self.scorelist.forEach(item=>{
        					item.statusinfo = item.status==-1?'缺考':'已评分';
        				});
        				self.totalcount = data.totalcount;
        			}
        		})
        	},
        	toRatedPaper(index,row){
        		this.$router.push({path:'/examManage/checkpaper',query:{examid:row.examid,paperid:row.paperid,stuid:row.stuid}})
        	}
        }
    }

</script>
<style scoped>
	.exam-cpu{
		border: 1px solid #e1eaf1;
        box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
        background-clip: content-box;
        margin-top:20px;
        padding:20px;
	}
	.exam-cpu-title{
		border-bottom:1px solid #e1eaf1;
		padding-bottom:10px;
	}
	.exam-cpu-title-item{
		width:30%;
	}
</style>