<template>
	<div class="examtheory">
		<p class="nav"><span class="blue">考试&试卷</span> > 查看考试</p>
		<div class="content">
			<p class="top">
				<span>考试名称：{{this.row.name}}</span>
				<span>课程：{{this.row.courseName}}</span>
				<span>考试类型：{{this.row.type}}</span>
				<span>考试形式：{{this.row.model}}</span>
				<span>考试时间：'{{this.row.time}}'</span>
				<span v-if="this.row.model!='理论机试'">考试状态：{{this.row.status | statusfn}}</span>
				<span v-if="this.row.model!='理论笔试'">试卷名称：'{{this.row.name}}'</span>
			</p>
			<div class="bottom">
				<el-tabs v-model="activeName" @tab-click="handleClick">
				    <el-tab-pane label="考试地点1" name="first">
				    	<p class="line">考试地点：3017教室</p>
				    	<p class="line">
				    		考生成绩：
				    		<el-button type="primary">成绩导入</el-button>
				    		<el-button>导入模板下载</el-button>
				    	</p>
				    	<div class="line">
				    		<el-table :data="list" border style="width: 100%">
						      <el-table-column type="index" label="序号" width="150"></el-table-column>
						      <el-table-column prop="name" label="考生姓名"></el-table-column>
						      <el-table-column prop="num" label="学号"></el-table-column>
						      <!--<el-table-column prop="grade" label="成绩"></el-table-column>
						      <el-table-column prop="statu" label="状态"></el-table-column>
						      <el-table-column prop="time" label="评分时间"></el-table-column>
						      <el-table-column label="操作">
						    	<template scope="scope">
									<el-button size="small" type="primary">评分</el-button>
									<el-button size="small" type="primary">查看</el-button>
								</template>
						      </el-table-column>	-->
						    </el-table>
				    	</div>
				    </el-tab-pane>
				    <el-tab-pane label="考试地点2" name="second">考试地点2</el-tab-pane>
				    <el-tab-pane label="考试地点3" name="third">考试地点3</el-tab-pane>
				</el-tabs>
			    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="40">
	    		</el-pagination>
	    		<p class="page"><el-button>返回</el-button></p>
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
  		row:this.$route.query.row,
  		
		activeName:'first',
		list:[{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},{name:'刘旦',num:'120612',grade:'100',statu:'已评分',time:'2017-06-01 08:00:00'},],
		currentPage:1,
  	}
},
filters:{
	statusfn:function(value){
		var status=value;
		switch (value){
			case 0: status="待考试";
				break;
			case 1: status="考试中";
				break;
			case 2: status="待评卷";
				break;
			case 3: status="已结束";
				break;
			default:
				break;
		}
		return status;
	}
},
mounted(){
	console.log(JSON.stringify(this.row))
	this.queryexamdetail();
},
methods:{
	handleClick(tab, event){
		console.log(tab, event);
	},
	handleSizeChange(val) {
	    console.log(`每页 ${val} 条`);
	},
	handleCurrentChange(val) {
	    console.log(`当前页: ${val}`);
	},
	queryexamdetail(){//查询考试详情
		var self=this;
		post('/unifyexam/queryexamdetail',{
            command:"unifyexam/queryexamdetail",
            loginid:getCookie('uid'),
            sessionid:getCookie('sid'),
            teacherid:getCookie('uid'),
            examid:self.row.examid
        }).done((res)=>{
            if(res.errcode==0){
            	
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
.bottom .el-tabs__header{
	border-bottom: 0;
}
.bottom .el-tabs{
	margin: 20px auto 0;
	width: 95%;
}
.line{
	margin-top: 20px;
}
.page{
	margin: 40px 0;
	text-align: center;
}
.el-table th,.el-table tr{
	text-align: center;
}
/*table tr th:first-child,table tr td:first-child{
	width: 100px;
}*/
</style>