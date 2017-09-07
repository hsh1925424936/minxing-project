<template>
	<div class="examtheory">
		<p class="nav"><span class="blue" @click="cancel">考试&试卷</span> > 查看考试</p>
		<div class="content">
			<el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="考生成绩查询" name="first">
			    	<div class="line">
			    		<p class="box">学生姓名 <el-input v-model="input"></el-input></p>
			    		<p class="box">学号 <el-input v-model="input"></el-input></p>
			    		<p class="box">训练项 
			    			<el-select v-model="value" placeholder="全部">
							    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
			    		</p>
			    		<p class="box">状态 
			    			<el-select v-model="value" placeholder="全部">
							    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
			    		</p>
			    		<el-button size="small" type="primary">查询</el-button>
			    	</div>
			    	<div class="line">
			    		<el-table :data="list" border style="width: 100%">
					      <el-table-column type="index" label="序号" width="100"></el-table-column>
					      <el-table-column prop="name" label="考生姓名"></el-table-column>
					      <el-table-column prop="num" label="学号"></el-table-column>
					      <el-table-column prop="learnname" label="训练项名称"></el-table-column>
					      <el-table-column prop="grade" label="成绩"></el-table-column>
					      <el-table-column prop="statu" label="状态"></el-table-column>
					      <el-table-column prop="uptime" label="上传时间"></el-table-column>
					      <el-table-column prop="time" label="评分时间"></el-table-column>
					      <el-table-column label="操作" width="150">
					    	<template scope="scope">
								<el-button size="small" type="primary">评分</el-button>
								<el-button size="small" type="primary">查看</el-button>
							</template>
					      </el-table-column>	
					    </el-table>
			    	</div>
			    </el-tab-pane>
			    <el-tab-pane label="考试总成绩" name="second">
			    	<div class="line">
			    		<p class="box">学生姓名 <el-input v-model="input"></el-input></p>
			    		<p class="box">学号 <el-input v-model="input"></el-input></p>
			    		<el-button size="small" type="primary">查询</el-button>
			    	</div>
			    	<div class="line">
			    		<el-table :data="list" border style="width: 100%">
					      <el-table-column type="index" label="序号" width="100"></el-table-column>
					      <el-table-column prop="name" label="考生姓名"></el-table-column>
					      <el-table-column prop="num" label="学号"></el-table-column>
					      <el-table-column prop="learnname" label="总分"></el-table-column>
					      <el-table-column prop="grade" label="各技能项成绩">
					      	<el-table-column prop="data1" label="腹部穿刺术"> </el-table-column>
					      	<el-table-column prop="data2" label="胸腔穿刺术"> </el-table-column>
					      	<el-table-column prop="data3" label="背部穿刺术"> </el-table-column>
					      	<el-table-column prop="data4" label="男性导尿术"> </el-table-column>
					      	<el-table-column prop="data5" label="女性导尿术"> </el-table-column>
					      </el-table-column>
					    </el-table>
			    	</div>
			    </el-tab-pane>
			    <el-tab-pane label="考试信息" name="third">
			    	<div class="line">
			    		<p class="box marginright">考试名称：呼吸外科2017年度期末考试</p>
			    		<p class="box marginright">考试类型：教师自主考试</p>
			    		<p class="box marginright">考试形式：操作考试</p>
			    		<p class="box marginright">考试时间：2017-06-30  -  2017-07-30</p>
			    		<p class="box marginright">考试状态：已完成</p>
			    		<p class="box marginright">考试时间：穿刺术操作综合考试</p>
			    		<p class="box marginright">考试总分：100分</p>
			    	</div>
			    	<div class="line">
			    		<p class="box" style="margin-bottom: 20px;">分值设置：</p>
			    		<el-table :data="list" border style="width: 100%">
					      <el-table-column type="index" label="序号" width="100"></el-table-column>
					      <el-table-column prop="name" label="题目名称"></el-table-column>
					      <el-table-column prop="num" label="所属学科"></el-table-column>
					      <el-table-column prop="learnname" label="标签"></el-table-column>
					      <el-table-column prop="grade" label="分值"></el-table-column>
					      <el-table-column label="操作" width="150">
					    	<template scope="scope">
								<el-button size="small" type="primary">查看</el-button>
							</template>
					      </el-table-column>	
					    </el-table>
			    	</div>
			    </el-tab-pane>
			    <el-tab-pane label="考试安排" name="fourth">
			    	<div class="content content1">
				    	<div class="linebor">
				    		<div class="linebox">
				    			<span>考生范围：</span>
				    			<div>
				    				临床医学2017级1班（30），临床医学2017级2班（20）
				    				<p>共200人</p>
				    			</div>
				    		</div>
				    	</div>	
				    	<div class="linebor" v-for="item in list">
				    		<div class="linebox marginbottom">考试操作1：男性导尿术</div>
				    		<div class="linebox marginbottom">考试时间：2017-05-30 08:00-2017-06-30 10:00</div>
				    		<div class="linebox marginbottom">评卷老师：王老师，15050440035</div>
				    	</div>
				    	<div class="linebor" style="border: none;margin-top: 50px;">
				    		共5个考场，300名考生
				    	</div>
			    	</div>
			    	
			    </el-tab-pane>
			</el-tabs>
		    <el-pagination v-if="activeName!='fourth'&&activeName!='third'" class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="40">
    		</el-pagination>
    		<p class="page"><el-button @click="cancel">返回</el-button></p>
		</div>
	</div>
</template>

<script>
export default {
	
data() {
  	return {
		activeName:'first',
		list:[],
		currentPage:1,
		options: [{value: '选项1',label: '黄金糕'}, {value: '选项2',label: '双皮奶'}, {value: '选项3',label: '蚵仔煎'}, {value: '选项4',label: '龙须面'}, {value: '选项5',label: '北京烤鸭'}],
		value:'',
		input:'',
  	}
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
	cancel(){
		this.$router.push({
		    name:'exam_test',
		    query:{
		    	
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
.content1{
	width: 95%;
	margin: auto;
}
.top{
	border-bottom: 1px solid #bfcbd9;
	padding: 25px 0 0 25px;
}
.top span{
	margin: 0 100px 25px 0;
}
.el-tabs__header{
	border-bottom: 0;
}
.el-tabs{
	margin-top: 10px;
}
.line{
	margin: 20px;
}
.box{
	display: inline-block;
	margin-right: 50px;
}
.marginright{
	margin: 0 100px 50px 0;	
}
.el-input{
	width: 150px;
	margin-left: 10px;
}
.page{
	margin: 40px 0;
	text-align: center;
}
.el-table th,.el-table tr{
	text-align: center;
}
.linebor{
	width: 95%;
	margin: 10px auto;
	padding: 10px 0;
	border-bottom: 1px solid #bfcbd9;
}
.linebox{
	width: 45%;
	display: inline-block;
}
.linebox div{
	display: inline-block;
	vertical-align: top;
}
.linebox p{
	margin-top: 20px;
}
.marginbottom{
	margin-bottom: 20px;
}
</style>